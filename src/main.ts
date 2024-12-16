import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './config/config.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<Config>);
  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
