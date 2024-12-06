import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mikroOrm: MikroOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mikroOrm.pingCheck('database'),
      () =>
        this.http.pingCheck(
          'AWS region: us-east-1',
          'https://sellingpartnerapi-na.amazon.com',
        ),
      () =>
        this.http.pingCheck(
          'AWS region: eu-west-1',
          'https://sellingpartnerapi-eu.amazon.com',
        ),
      () =>
        this.http.pingCheck(
          'AWS region: us-west-2',
          'https://sellingpartnerapi-fe.amazon.com',
        ),
    ]);
  }
}
