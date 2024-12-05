import { Migration } from '@mikro-orm/migrations';

export class Migration20241205060616 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "store" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "is_active" boolean not null default true);`);

    this.addSql(`create table "client" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "client_provider" text check ("client_provider" in ('SELLING_PARTNER_API', 'ADVERTISING_API')) not null, "client_id" varchar(255) not null, "client_secret" varchar(255) not null, "grant_type" text check ("grant_type" in ('client_credentials', 'refresh_token')) not null, "refresh_token" varchar(255) not null, "error" smallint not null, "error_description" varchar(255) not null, "store_id" int not null);`);

    this.addSql(`alter table "client" add constraint "client_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;`);
  }

}
