import { LWAExceptionErrorCode } from '../../client/exceptions/exception-error-code';

export class TokenErrorDto {
  error: LWAExceptionErrorCode;
  error_description: string;
}

export class RefreshResponseDto {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}
