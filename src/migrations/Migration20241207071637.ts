import { Migration } from '@mikro-orm/migrations';

export class Migration20241207071637 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "listing" add constraint "listing_asin_seller_sku_client_id_unique" unique ("asin", "seller_sku", "client_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "listing" drop constraint "listing_asin_seller_sku_client_id_unique";`);
  }

}
