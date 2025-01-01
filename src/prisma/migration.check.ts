import { Client } from 'pg';
import { existsSync, readdirSync } from 'fs';
import { hashFile } from 'src/common/utils/hashFile';

export async function checkLatestMigration(): Promise<void> {
  const getLatestMigration = (): string => {
    const migrationDir = 'src/prisma/migrations';
    if (!existsSync(migrationDir)) {
      throw new Error(`Prisma migration directory not found: ${migrationDir}`);
    }

    const migrations: string[] = readdirSync(migrationDir, { withFileTypes: true })
      .filter((file) => file.isDirectory() && /^\d/.test(file.name))
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
      WHERE table_schema = '${DATABASE_SCHEMA}' AND table_name = '_prisma_migrations' );`,
    );

    if (!prismaMigrationsExists.rows[0].exists) {
      const latestMigrationName = getLatestMigration();
      const checksum = await hashFile(`src/prisma/migrations/${latestMigrationName}/migration.sql`);
      const createTableQuery = `
      CREATE TABLE "${DATABASE_SCHEMA}"."_prisma_migrations" (
        "id" VARCHAR(36) NOT NULL,
        "checksum" VARCHAR(64) NOT NULL,
        "finished_at" TIMESTAMPTZ(6),
        "migration_name" VARCHAR(255) NOT NULL,
        "logs" TEXT,
        "rolled_back_at" TIMESTAMPTZ(6),
        "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
      );`;
      await client.query(createTableQuery);

      const migrationId = crypto.randomUUID();
      const startedAt = new Date();
      const finishedAt = new Date(startedAt.getTime() + 1234);
      const appliedStepsCount = 1;
      const insertQuery = `
      INSERT INTO "${DATABASE_SCHEMA}"."_prisma_migrations" (
        "id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count"
      ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )
      ON CONFLICT ("id") DO NOTHING;`;
      await client.query(insertQuery, [
        migrationId,
        checksum,
        finishedAt.toISOString(),
        latestMigrationName,
        null, // logs
        null, // rolled_back_at
        startedAt.toISOString(),
        appliedStepsCount,
      ]);
    }
  } catch (error) {
    console.error(
      'Error adding migration data to database:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  } finally {
    await client?.end();
  }
}
