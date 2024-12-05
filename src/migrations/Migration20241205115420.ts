import { Migration } from '@mikro-orm/migrations';

export class Migration20241205115420 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "client" alter column "error" type smallint using ("error"::smallint);`);
    this.addSql(`alter table "client" alter column "error" drop not null;`);
    this.addSql(`alter table "client" alter column "error_description" type varchar(255) using ("error_description"::varchar(255));`);
    this.addSql(`alter table "client" alter column "error_description" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "client" alter column "error" type smallint using ("error"::smallint);`);
    this.addSql(`alter table "client" alter column "error" set not null;`);
    this.addSql(`alter table "client" alter column "error_description" type varchar(255) using ("error_description"::varchar(255));`);
    this.addSql(`alter table "client" alter column "error_description" set not null;`);
  }

}
