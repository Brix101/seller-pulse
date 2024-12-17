import { EntityManager } from '@mikro-orm/core';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { CacheService } from 'src/cache/cache.service';
import { Client } from '../client/entities/client.entity';
import { LWAExceptionErrorCode } from '../client/exceptions/exception-error-code';
import { RequestAccessTokenDto } from './dto/lwa-request.dto';
import { RefreshResponseDto, TokenErrorDto } from './dto/lwa-response.dto';

@Injectable()
export class LwaService {
  private logger = new Logger(LwaService.name);

  private readonly URL = 'https://api.amazon.com/auth/o2/token';
  private readonly PREFIX = 'lwa:';

  constructor(
    private readonly httpService: HttpService,
    private readonly em: EntityManager,
    private readonly cacheService: CacheService,
  ) {}

  private async refreshAccessToken(
    client: Client,
  ): Promise<RefreshResponseDto> {
    const requestAccessTokenDto = client.toRequestAcessTokenDTO();

    this.logger.debug(`Refreshing token for client ${client.clientId}`);

    const { data } = await firstValueFrom(
      this.httpService
        .post<
          RefreshResponseDto,
          RequestAccessTokenDto
        >(this.URL, requestAccessTokenDto)
        .pipe(
          catchError(async (error: AxiosError<TokenErrorDto>) => {
            const data = error.response?.data || {
              error: LWAExceptionErrorCode.other,
              error_description: 'Unknown error',
            };

            await this.em.nativeUpdate(
              Client,
              { clientId: client.clientId },
              {
                error: LWAExceptionErrorCode[data.error],
                errorDescription: data.error_description,
              },
            );

            this.logger.warn(
              { clientId: client.clientId, ...data },
              'Error refreshing token',
            );

            throw new UnauthorizedException(data.error, data.error_description);
          }),
        ),
    );

    await this.cacheService.set(
      `${this.PREFIX}${client.clientId}`,
      data.access_token,
      data.expires_in * 1000 - 60000,
    );

    return data;
  }

  async getAccessToken(client: Client): Promise<string> {
    const key = `${this.PREFIX}${client.clientId}`;

    const cachedToken = await this.cacheService.get<string>(key);

    if (cachedToken) {
      return cachedToken;
    }

    const result = await this.refreshAccessToken(client);

    return result.access_token;
  }
}
