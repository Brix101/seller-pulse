import { Migration } from '@mikro-orm/migrations';

export class Migration20241207014114 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "listing" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "seller_sku" varchar(255) not null, "asin" varchar(255) not null, "status" text check ("status" in ('active', 'inactive', 'incomplete')) not null, "client_id" int not null);`);

    this.addSql(`alter table "listing" add constraint "listing_client_id_foreign" foreign key ("client_id") references "client" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "listing" cascade;`);
  }

}
