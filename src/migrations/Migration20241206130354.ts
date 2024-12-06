import { Migration } from '@mikro-orm/migrations';

export class Migration20241206130354 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "client" drop constraint if exists "client_error_check";`);

    this.addSql(`alter table "client" alter column "error" type text using ("error"::text);`);
    this.addSql(`alter table "client" add constraint "client_error_check" check("error" in ('access_denied', 'invalid_grant', 'invalid_request', 'invalid_scope', 'server_error', 'unsupported_grant_type', 'temporarily_unavailable', 'unauthorized_client', 'invalid_client', 'other'));`);

    this.addSql(`alter table "marketplace" add constraint "marketplace_marketplace_id_client_id_unique" unique ("marketplace_id", "client_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "client" drop constraint if exists "client_error_check";`);

    this.addSql(`alter table "client" alter column "error" type smallint using ("error"::smallint);`);

    this.addSql(`alter table "marketplace" drop constraint "marketplace_marketplace_id_client_id_unique";`);
  }

}
