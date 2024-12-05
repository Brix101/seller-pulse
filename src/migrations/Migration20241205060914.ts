import { Migration } from '@mikro-orm/migrations';

export class Migration20241205060914 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "marketplace" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "country" varchar(255) not null, "marketplace_id" varchar(255) not null, "country_code" varchar(255) not null, "default_currency_code" varchar(255) not null, "default_language_code" varchar(255) not null, "domain_name" varchar(255) not null);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "marketplace" cascade;`);
  }

}
