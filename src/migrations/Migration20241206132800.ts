import { Migration } from '@mikro-orm/migrations';

export class Migration20241206132800 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "marketplace" add column "region" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "marketplace" drop column "region";`);
  }

}
