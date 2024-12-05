import { Migration } from '@mikro-orm/migrations';

export class Migration20241205120059 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "client" alter column "refresh_token" type text using ("refresh_token"::text);`);
    this.addSql(`alter table "client" alter column "error_description" type text using ("error_description"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "client" alter column "refresh_token" type varchar(255) using ("refresh_token"::varchar(255));`);
    this.addSql(`alter table "client" alter column "error_description" type varchar(255) using ("error_description"::varchar(255));`);
  }

}
