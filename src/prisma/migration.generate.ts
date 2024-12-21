import { execSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { COLOR, colorString } from 'src/common/utils/color';

export function migrationGenerate(): void {
  const pid = process.pid;
  const defaultColor = COLOR.gray;

  const formatPrefix = (color = COLOR.green) =>
    colorString(color, `[DATABASE MIGRATION] ${pid} - `) +
    new Date().toLocaleTimeString() +
    colorString(COLOR.green, ' |');
  const print = (...msg: string[]) => console.log(formatPrefix(), ...msg);

  const getLatestMigration = (): string => {
    const migrationDir = 'src/prisma/migrations';
    if (!existsSync(migrationDir)) {
      throw new Error(`Migration directory not found: ${migrationDir}`);
    }

    const migrations: string[] = readdirSync(migrationDir, { withFileTypes: true })
      .filter((file) => file.isDirectory() && /^\d/.test(file.name))
      .map((file) => file.name);

    if (migrations.length === 0) {
      throw new Error('No migrations found in the directory');
    }

    return migrations.sort((a, b) => b.localeCompare(a))[0];
  };

  const fixMigrationFile = (migration: string): void => {
    const migrationPath = `src/prisma/migrations/${migration}/migration.sql`;

    if (!existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }

    const content = readFileSync(migrationPath, 'utf-8');
    const updatedContent = content.replace(
      '"id" INTEGER NOT NULL DEFAULT nextval(\'_typeorm_migrations_id_seq\'::regclass)',
      '"id" SERIAL NOT NULL',
    );

    writeFileSync(migrationPath, updatedContent, 'utf-8');
    print(
      colorString(COLOR.green, 'Migration file processed successfully:'),
      colorString(COLOR.blue, migrationPath),
    );
  };

  try {
    print(colorString(defaultColor, 'Generating prisma initial migration...'));
    execSync(`npx prisma migrate dev --create-only --name init`);

    const latestMigration = getLatestMigration();
    print(
      colorString(
        defaultColor,
        'Prisma Migrate created the following migration without applying it:',
      ),
      colorString(COLOR.blue, latestMigration),
    );

    fixMigrationFile(latestMigration);
    execSync(`npx prisma migrate deploy`, { stdio: 'inherit' });
  } catch (error) {
    console.error(
      formatPrefix(COLOR.red),
      colorString(COLOR.red, 'Error during migration generation:'),
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}
