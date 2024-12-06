import { EntityManager } from '@mikro-orm/postgresql';
import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Client } from 'src/client/entities/client.entity';
import { TokenErrorDto } from './dto/token-error.dto';
import { TokenRequestMeta } from './dto/token-request-meta';
import { RefreshResponseDto } from './dto/token-response.dto';
import { LWAExceptionErrorCode } from './exceptions/exception-error-code';

@Injectable()
export class LwaService {
  private readonly logger = new Logger(LwaService.name);
  private URL: string = 'https://api.amazon.com/auth/o2/token';

  constructor(
    private readonly httpService: HttpService,
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async refreshAccessToken(
    client: Client,
  ): Promise<RefreshResponseDto | null> {
    const fork = this.em.fork();
    const refreshData = client.toTokenRequestMeta();

    const { data, status } = await firstValueFrom(
      this.httpService.post<
        RefreshResponseDto & TokenErrorDto,
        TokenRequestMeta
      >(this.URL, refreshData),
    );

    if (status !== 200) {
      const error =
        LWAExceptionErrorCode[
          data.error as unknown as keyof typeof LWAExceptionErrorCode
        ] || LWAExceptionErrorCode.other;
      const errorDescription = data.error_description || 'Something went wrong';

      fork.assign(client, { error, errorDescription });
      await fork.persistAndFlush(client);

      this.logger.error(
        `Error refreshing token for client ${client.clientId}: ${errorDescription}`,
      );

      return null;
    }

    return data;
  }

  private async setAccessToken(
    client: Client,
    refreshResponseDto: RefreshResponseDto,
  ) {
    const ttl = refreshResponseDto.expires_in * 1000 - 60000;

    await this.cacheManager.set(
      client.clientId,
      refreshResponseDto.access_token,
      ttl,
    );
  }

  async getAccessToken(client: Client): Promise<string> {
    const token = await this.cacheManager.get<string>(client.clientId);

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
