import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { COLOR, colorString } from 'src/common/utils/color';
import { setDatasourceUrl } from './datasourceUrl';

function generateMigrationDirectoryName(name: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}_${name}`;
}

function applyMigrations(): void {
  try {
    console.log(); // empty line
    execSync(`npx prisma migrate deploy`, { stdio: 'inherit' });
    console.log(); // empty line
  } catch {
    process.exit(1);
  }
}

function getMigrateStatus(): string {
  try {
    return execSync('npx prisma migrate status', { encoding: 'utf-8' });
  } catch (error) {
    if (error instanceof Error && 'stdout' in error) {
      return String(error.stdout);
    }
    throw error;
  }
}

export function migrationCheck(first_start = false): void {
  setDatasourceUrl();
  if (first_start) {
    applyMigrations();
    return;
  }
  const migrationStatus = getMigrateStatus();
  if (migrationStatus.includes('Database schema is up to date!')) {
    console.log(
      colorString(COLOR.green, `[DB PRISMA MIGRATION] ${process.pid} - `) +
        new Date().toLocaleTimeString() +
        colorString(COLOR.green, ' |'),
      colorString(COLOR.gray, 'Prisma database schema is up to date'),
    );
  } else {
    if (migrationStatus.includes('No migration found')) {
      migrationGenerate();
      applyMigrations();
    } else if (migrationStatus.search(/Following migrations? have not yet been applied/) !== -1) {
      applyMigrations();
    } else {
      console.error(migrationStatus);
      process.exit(1);
    }
  }
}

export function migrationGenerate(): void {
  const pid = process.pid;
  const defaultColor = COLOR.gray;

  const formatPrefix = (color = COLOR.green) =>
    colorString(color, `[DB PRISMA MIGRATION] ${pid} - `) +
    new Date().toLocaleTimeString() +
    colorString(COLOR.green, ' |');

  const print = (...msg: string[]) => console.log(formatPrefix(), ...msg);

  const fixMigrationFile = (migrationPath: string): void => {
    if (!existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }

    const content = readFileSync(migrationPath, 'utf-8');
    const updatedContent = content.replace(
      '"id" INTEGER NOT NULL DEFAULT nextval(\'_typeorm_migrations_id_seq\'::regclass)',
      '"id" SERIAL NOT NULL',
    );

    writeFileSync(migrationPath, updatedContent, 'utf-8');
  };

  const migrationName = 'init';
  const migrationsDir = 'src/prisma/migrations';
  const timestampedDirName = generateMigrationDirectoryName(migrationName);
  const migrationPath = `${migrationsDir}/${timestampedDirName}`;
  const migrationFile = `${migrationPath}/migration.sql`;
  try {
    mkdirSync(migrationPath, { recursive: true });

    print(colorString(defaultColor, 'Generating prisma initial migration...'));
    setDatasourceUrl();
    execSync(
      `npx prisma migrate diff --from-empty --to-schema-datamodel src/prisma/schema.prisma --script > ${migrationFile}`,
    );

    print(
      colorString(
        defaultColor,
        'Prisma migrate created the following migration without applying it:',
      ),
      colorString(COLOR.blue, timestampedDirName),
    );

    fixMigrationFile(migrationFile);

    print(
      colorString(COLOR.green, 'Migration file processed successfully:'),
      colorString(COLOR.blue, migrationPath),
    );
  } catch (error) {
    console.error(
      formatPrefix(COLOR.red),
      colorString(COLOR.red, 'Error during migration generation:'),
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}
