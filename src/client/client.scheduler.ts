import { CreateRequestContext, MikroORM } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientService } from './client.service';

@Injectable()
export class ClientScheduler {
  private logger = new Logger(ClientScheduler.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly clientService: ClientService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @CreateRequestContext()
  async handleMarketplaceCronJob() {
    this.logger.debug('Running marketplace cron job');
    const clients = await this.clientService.findAll();

    for (const client of clients) {
      this.clientService.updateMarketplace(client);
    }
    this.logger.debug('Marketplace cron job completed');
  }
}
