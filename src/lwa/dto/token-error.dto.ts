import { LWAExceptionErrorCode } from '../exceptions/exception-error-code';

export class TokenErrorDto {
  error: LWAExceptionErrorCode;
  error_description: string;
}
