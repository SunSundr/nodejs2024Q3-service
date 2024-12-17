import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { migrationReplace } from './migration.replace';
import { loadEnv } from 'src/common/utils/load.env';
import { COLOR, colorString } from 'src/common/utils/color';

/**
 * Generates a TypeORM migration file.
 *
 * @param {Object} options - Options for migration generation.  Defaults to an empty object if no options are provided.
 * @param {string} [options.path] - The path to the migration file. If not provided, it will be automatically generated.
 * @param {string} [options.migrationName] - The name of the migration. Defaults to 'InitialMigration'.
 * @param {number} [options.timestamp] - The timestamp for the migration.  Defaults to the current timestamp.
 * @param {boolean} [options.loadEnv] - Whether to load environment variables. Defaults to `false`.
 * @param {boolean} [options.clearOldMigrations] - Whether to clear old migrations from the 'dist/typeorm/migrations' directory. Defaults to `false`.
 * @throws {Error} If there's an error during migration generation.  The error message will be logged to the console.
 */
export function migrationGenerate(
  options: { [key: string]: string | number | boolean } = {},
): void {
  const pid = process.pid;
  const defaultColor = COLOR.gray;
  const formatPrefix = (color = COLOR.green) =>
    colorString(color, `[DATABASE MIGRATION] ${pid} - `) +
    new Date().toLocaleTimeString() +
    colorString(COLOR.green, ' |');
  const print = (...msg: string[]) => console.log(formatPrefix(), ...msg);

  try {
    if (!options.path || !options.migrationName || !options.timestamp) {
      const args = process.argv;
      for (let i = 2, argsLen = args.length; i < argsLen; i++) {
        switch (args[i]) {
          case '--path':
            if (args[i + 1]) options.path = args[i + 1].replace(/^"([^"]*)"$/, '$1');
            break;
          case '--migrationName':
            if (args[i + 1]) options.migrationName = args[i + 1];
            break;
          case '--timestamp':
            if (args[i + 1]) options.timestamp = args[i + 1];
            break;
        }
        if (options.path && options.migrationName && options.timestamp) break;
      }
      if (!options.migrationName) options.migrationName = 'InitialMigration';
      if (!options.timestamp)
        // options.timestamp = new Date('2024-01-01T00:00:00Z').getTime().toString();
        options.timestamp = Date.now();
      if (!options.path)
        options.path = `src/typeorm/migrations/${options.timestamp}-${options.migrationName}.ts`;
    }
    if (options.loadEnv) loadEnv();
    if (typeof options.path !== 'string') options.path = options.path.toString();

    const shellCommands = {
      generate:
        `npx typeorm-ts-node-commonjs migration:generate "src/typeorm/migrations/${options.migrationName}" ` +
        `--dataSource "dist/typeorm/data-source.js" ` + // `-d`
        `--timestamp ${options.timestamp} ` + // `-t`
        `--pretty`,
      // `--check`,
      compile:
        `npx tsc "${options.path}" ` +
        `--outDir "dist/typeorm/migrations" ` +
        `--target es2017 ` +
        `--module commonjs ` +
        `--declaration ` +
        `--declarationMap ` +
        `--strict`,
    };

    print(colorString(defaultColor, 'Database migration check...'));
    try {
      execSync(shellCommands.generate);
      print(
        colorString(COLOR.green, 'Migration file generated successfully:'),
        colorString(COLOR.blue, options.path),
      );
    } catch {
      print(colorString(defaultColor, 'No changes in database schema were found'));
    }

    if (existsSync(options.path)) {
      print(
        colorString(
          defaultColor,
          'Modifying the migration file to work with any current schema...',
        ),
      );
      migrationReplace(options.path, true);
      print(
        colorString(COLOR.green, 'Migration file processed successfully:'),
        colorString(COLOR.blue, options.path),
      );

      if (options.clearOldMigrations)
        rmSync('dist/typeorm/migrations', { recursive: true, force: true });
      print(colorString(defaultColor, 'Compiling migration...'));
      execSync(shellCommands.compile, { stdio: 'inherit' });

      print(
        colorString(COLOR.green, 'Migration file compiled successfully:'),
        colorString(COLOR.blue, 'dist/typeorm/migrations'),
      );
    }
  } catch (error) {
    console.error(
      formatPrefix(COLOR.red),
      colorString(COLOR.red, 'Error during migration generation:'),
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}
