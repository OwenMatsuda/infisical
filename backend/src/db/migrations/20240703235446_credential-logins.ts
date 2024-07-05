import { Knex } from "knex";

import { TableName } from "../schemas";

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable(TableName.CredentialLogin))) {
    await knex.schema.createTable(TableName.CredentialLogin, (tb) => {
      tb.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
      tb.timestamps(true, true, true);
      tb.uuid("orgId").notNullable();
      tb.foreign("orgId").references("id").inTable(TableName.Organization);
      tb.uuid("userId").notNullable();
      tb.foreign("userId").references("id").inTable(TableName.Users);
      tb.string("name").notNullable();
      tb.string("website");
      tb.string("username").notNullable();
      tb.string("password").notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TableName.CredentialLogin);
}
