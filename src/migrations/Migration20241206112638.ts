import { Migration } from '@mikro-orm/migrations';

export class Migration20241206112638 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "client" add constraint "client_client_id_store_id_unique" unique ("client_id", "store_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "client" drop constraint "client_client_id_store_id_unique";`);
  }

}
