import { Migration } from '@mikro-orm/migrations';

export class Migration20241207030011 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "marketplace" alter column "region" type text using ("region"::text);`);
    this.addSql(`alter table "marketplace" add constraint "marketplace_region_check" check("region" in ('NorthAmerica', 'Europe', 'FarEast'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "marketplace" drop constraint if exists "marketplace_region_check";`);

    this.addSql(`alter table "marketplace" alter column "region" type varchar(255) using ("region"::varchar(255));`);
  }

}
