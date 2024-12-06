import { Migration } from '@mikro-orm/migrations';

export class Migration20241206023654 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "marketplace" add column "client_id" int not null;`);
    this.addSql(`alter table "marketplace" add constraint "marketplace_client_id_foreign" foreign key ("client_id") references "client" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "marketplace" drop constraint "marketplace_client_id_foreign";`);

    this.addSql(`alter table "marketplace" drop column "client_id";`);
  }

}
