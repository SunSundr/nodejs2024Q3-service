import { Client } from 'pg';
import { existsSync, readdirSync } from 'fs';

export async function checkLatestMigration(): Promise<void> {
  const getLatestMigration = (): string => {
    const migrationDir = 'src/typeorm/migrations';
    if (!existsSync(migrationDir)) {
      throw new Error(`Typorm migration directory not found: ${migrationDir}`);
    }

    const migrations: string[] = readdirSync(migrationDir, { withFileTypes: true })
      .filter((file) => !file.isDirectory() && /^\d/.test(file.name))
      .map((file) => file.name);

    if (migrations.length === 0) {
      throw new Error('No migrations found in the directory');
    }

    return migrations.sort((a, b) => b.localeCompare(a))[0];
  };

  const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_SCHEMA } =
    process.env;

  let client: Client;

  try {
    const latestMigrationName = getLatestMigration().slice(0, -3);
    const dataParts = latestMigrationName.split('-');
    const timestamp = dataParts.shift();
    let name = dataParts.join('').replace(/[^a-zA-Z0-9$_]/g, '') + timestamp;
    name = name.charAt(0).toUpperCase() + name.slice(1);

    client = new Client({
      host: DATABASE_HOST,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
    });
    await client.connect();

    const prismaMigrationsExists = await client.query<{ exists: boolean }>(
      `SELECT EXISTS ( 
         SELECT 1 FROM information_schema.tables 
         WHERE table_schema = '${DATABASE_SCHEMA}' AND table_name = '_typeorm_migrations' );`,
    );

    if (!prismaMigrationsExists.rows[0].exists) {
      const createTableQuery = `
      CREATE TABLE "${DATABASE_SCHEMA}"."_typeorm_migrations" (
        "id" SERIAL NOT NULL,
        "timestamp" BIGINT NOT NULL,
        "name" VARCHAR NOT NULL,
         CONSTRAINT "PK__typeorm_migrations_Id" PRIMARY KEY ("id")
      );`;
      await client.query(createTableQuery);
    } else {
      const result = await client.query<{ name: string }>(
        `SELECT "name" FROM "${DATABASE_SCHEMA}"."_typeorm_migrations";`,
      );
      const names = result.rows.map((row) => row.name);
      if (names.includes(name)) return;
    }

    const insertQuery = `INSERT INTO "${DATABASE_SCHEMA}"."_typeorm_migrations" ("timestamp", "name") VALUES ($1, $2);`;
    await client.query(insertQuery, [timestamp, name]);
  } catch (error) {
    console.error(
      'Error adding typeorm migration data to database:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  } finally {
    await client?.end();
  }
}
