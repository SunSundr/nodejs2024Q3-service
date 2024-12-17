import { readFileSync, writeFileSync } from 'fs';
import { COLOR, colorString } from 'src/common/utils/color';

export function migrationReplace(path: string | null = null, silent = false): void {
  if (!path) {
    const args = process.argv;
    for (let i = 2, argsLen = args.length; i < argsLen; i++) {
      if (args[i] === '--path' && args[i + 1]) {
        path = args[i + 1].replace(/^"([^"]*)"$/, '$1');
        break;
      }
    }
    if (!path) throw new Error('The --path argument is required.');
  }

  const envSchema = 'process.env.DATABASE_SCHEMA';
  let migration: string;

  try {
    migration = readFileSync(path, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read the file at path: ${path}. Error: ${error.message}`);
  }

  if (migration.includes(envSchema)) {
    console.error(colorString(COLOR.red, 'Error: The file has already been processed'));
    return;
  }

  const classNameMatch = migration.match(/export\s+class\s+(\w+)\s+implements/);
  if (!classNameMatch) {
    throw new Error('The file format is unknown. No class declaration found.');
  }

  const className = classNameMatch[1];
  const updatedMigration = migration
    .replace(
      new RegExp(`^(\\s*)name\\s*=\\s*'${className}'`, 'm'),
      (match, spaces) => `${match}\n${spaces}schema = ${envSchema}`,
    )
    .replace(new RegExp(process.env.DATABASE_SCHEMA, 'g'), '${this.schema}');

  try {
    writeFileSync(path, updatedMigration);
  } catch (error) {
    throw new Error(`Failed to write to the file at path: ${path}. Error: ${error.message}`);
  }

  if (!silent) {
    console.log(
      colorString(COLOR.green, 'Migration file processed successfully:'),
      colorString(COLOR.blue, path),
    );
  }
}
