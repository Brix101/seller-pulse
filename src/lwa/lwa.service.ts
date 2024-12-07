import { EntityManager } from '@mikro-orm/postgresql';
import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { Client } from 'src/client/entities/client.entity';
import { RequestAccessTokenDto } from './dto/request-access-token.dto';
import { TokenErrorDto } from './dto/token-error.dto';
import { RefreshResponseDto } from './dto/token-response.dto';
import { LWAExceptionErrorCode } from './exceptions/exception-error-code';

@Injectable()
export class LwaService {
  private logger = new Logger(LwaService.name);

  private readonly URL = 'https://api.amazon.com/auth/o2/token';
  private readonly PREFIX = 'lwa:';

  constructor(
    private readonly httpService: HttpService,
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async refreshAccessToken(
    client: Client,
  ): Promise<RefreshResponseDto | null> {
    const fork = this.em.fork();
    const requestAccessTokenDto = client.toRequestAcessTokenDTO();

    this.logger.debug(`Refreshing token for client ${client.clientId}`);

    const { data } = await firstValueFrom(
      this.httpService
        .post<
          RefreshResponseDto & TokenErrorDto,
          RequestAccessTokenDto
        >(this.URL, requestAccessTokenDto)
        .pipe(
          catchError(async (error) => {
            console.log(error);
            if (error.response) {
              const data = error.response.data;

              const errorCode =
                LWAExceptionErrorCode[
                  data.error as keyof typeof LWAExceptionErrorCode
                ] || LWAExceptionErrorCode.other;

              const errorDescription = data.error_description;

              fork.assign(client, { error: errorCode, errorDescription });
              await fork.persistAndFlush(client);

              this.logger.error(
                `Error refreshing token for client ${client.clientId}: ${errorDescription}`,
              );
            }

            throw error;
          }),
        ),
    );

    return data;
  }

  private async setAccessToken(
    client: Client,
    refreshResponseDto: RefreshResponseDto,
  ) {
    const ttl = refreshResponseDto.expires_in * 1000 - 60000;

    await this.cacheManager.set(
      this.PREFIX + client.clientId,
      refreshResponseDto.access_token,
      ttl,
    );
  }

  async getAccessToken(client: Client): Promise<string> {
    const token = await this.cacheManager.get<string>(
      this.PREFIX + client.clientId,
    );

    if (token) {
      return token;
    }

    const refreshResponseDto = await this.refreshAccessToken(client);
    if (!refreshResponseDto) {
      return null;
    }

    await this.setAccessToken(client, refreshResponseDto);

    return refreshResponseDto.access_token;
  }
}
