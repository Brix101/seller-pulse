import { Migration } from '@mikro-orm/migrations';

export class Migration20241207024945 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "client" add column "region" text check ("region" in ('NorthAmerica', 'Europe', 'FarEast')) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "client" drop column "region";`);
  }

}
