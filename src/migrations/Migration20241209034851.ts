import { Migration } from '@mikro-orm/migrations';

export class Migration20241209034851 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "store" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "is_active" boolean not null default true);`,
    );

    this.addSql(
      `create table "client" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "client_provider" text check ("client_provider" in ('SELLING_PARTNER_API', 'ADVERTISING_API')) not null, "client_id" varchar(255) not null, "client_secret" varchar(255) not null, "grant_type" text check ("grant_type" in ('client_credentials', 'refresh_token')) not null, "refresh_token" text not null, "region" text check ("region" in ('NorthAmerica', 'Europe', 'FarEast')) null, "error" text check ("error" in ('access_denied', 'invalid_grant', 'invalid_request', 'invalid_scope', 'server_error', 'unsupported_grant_type', 'temporarily_unavailable', 'unauthorized_client', 'invalid_client', 'other')) null, "error_description" text null, "store_id" int not null);`,
    );
    this.addSql(
      `alter table "client" add constraint "client_client_id_store_id_unique" unique ("client_id", "store_id");`,
    );

    this.addSql(
      `create table "marketplace" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "country" varchar(255) not null, "marketplace_id" varchar(255) not null, "country_code" varchar(255) not null, "default_currency_code" varchar(255) not null, "default_language_code" varchar(255) not null, "domain_name" varchar(255) not null, "region" text check ("region" in ('NorthAmerica', 'Europe', 'FarEast')) not null, "client_id" int not null);`,
    );
    this.addSql(
      `alter table "marketplace" add constraint "marketplace_marketplace_id_client_id_unique" unique ("marketplace_id", "client_id");`,
    );

    this.addSql(
      `create table "listing" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "seller_sku" varchar(255) not null, "asin" varchar(255) not null, "status" text check ("status" in ('active', 'inactive', 'incomplete')) not null, "client_id" int not null);`,
    );
    this.addSql(
      `alter table "listing" add constraint "listing_asin_seller_sku_client_id_unique" unique ("asin", "seller_sku", "client_id");`,
    );

    this.addSql(
      `alter table "client" add constraint "client_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "marketplace" add constraint "marketplace_client_id_foreign" foreign key ("client_id") references "client" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "listing" add constraint "listing_client_id_foreign" foreign key ("client_id") references "client" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "client" drop constraint "client_store_id_foreign";`,
    );

    this.addSql(
      `alter table "marketplace" drop constraint "marketplace_client_id_foreign";`,
    );

    this.addSql(
      `alter table "listing" drop constraint "listing_client_id_foreign";`,
    );

    this.addSql(`drop table if exists "store" cascade;`);

    this.addSql(`drop table if exists "client" cascade;`);

    this.addSql(`drop table if exists "marketplace" cascade;`);

    this.addSql(`drop table if exists "listing" cascade;`);
  }
}
