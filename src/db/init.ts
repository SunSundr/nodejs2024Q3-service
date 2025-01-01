import { Client } from 'pg';
import { COLOR, colorString } from 'src/common/utils/color';

async function initializeDatabase(): Promise<void> {
  const defaultColor = COLOR.gray;
  const pid = process.pid;
  const formatPrefix = (color = COLOR.green) =>
    colorString(color, `[DB INIT] ${pid} - `) +
    new Date().toLocaleTimeString() +
    colorString(COLOR.green, ' |');
  const format = (msg: string, color = COLOR.white) => colorString(color, `"${msg}"`);
  const print = (...msg: string[]) => console.log(formatPrefix(), ...msg);
  const etc = colorString(defaultColor, '...');

  const {
    DATABASE_HOST,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    DATABASE_SCHEMA,
    POSTGRES_PASSWORD,
  } = process.env;

  let client: Client;

  try {
    print(colorString(defaultColor, 'Connecting to PostgreSQL...'));

    client = new Client({
      host: DATABASE_HOST,
      user: 'postgres',
      password: POSTGRES_PASSWORD,
      database: 'postgres',
    });
    await client.connect();

    // USER:
    //-----------------------------------------------------------------------------------
    const userExists = await client.query<{ exists: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = $1) AS exists`,
      [DATABASE_USER],
    );
    if (!userExists.rows[0].exists) {
      print(colorString(defaultColor, 'Creating USER'), format(DATABASE_USER) + etc);
      await client.query(`CREATE USER "${DATABASE_USER}" WITH PASSWORD '${DATABASE_PASSWORD}';`);
    }

    // DATABASE:
    //-----------------------------------------------------------------------------------
    const dbExists = await client.query<{ exists: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = $1) AS exists`,
      [DATABASE_NAME],
    );

    if (!dbExists.rows[0].exists) {
      print(colorString(defaultColor, 'Creating DATABASE'), format(DATABASE_NAME) + etc);
      await client.query(`CREATE DATABASE "${DATABASE_NAME}" OWNER "${DATABASE_USER}";`);
    } else {
      const privilegesCheck = await client.query<{ has_connect: boolean; has_create: boolean }>(
        `SELECT 
          has_database_privilege($1, $2, 'CONNECT') AS has_connect,
          has_database_privilege($1, $2, 'CREATE') AS has_create`,
        [DATABASE_USER, DATABASE_NAME],
      );

      const { has_connect, has_create } = privilegesCheck.rows[0];

      if (!has_connect || !has_create) {
        print(
          colorString(defaultColor, 'Granting necessary privileges to'),
          format(DATABASE_USER),
          colorString(defaultColor, 'on database'),
          format(DATABASE_NAME) + etc,
        );

        if (!has_connect) {
          await client.query(`GRANT CONNECT ON DATABASE "${DATABASE_NAME}" TO "${DATABASE_USER}";`);
          print(colorString(defaultColor, 'Granted CONNECT privilege to'), format(DATABASE_USER));
        }

        if (!has_create) {
          await client.query(`GRANT CREATE ON DATABASE "${DATABASE_NAME}" TO "${DATABASE_USER}";`);
          print(colorString(defaultColor, 'Granted CREATE privilege to'), format(DATABASE_USER));
        }

        // All CONTROLS:
        //-----------------------------------------------------------------------------------
        // await client.query(`
        //   GRANT CONNECT ON DATABASE "${DATABASE_NAME}" TO "${DATABASE_USER}";
        //   GRANT CREATE ON DATABASE "${DATABASE_NAME}" TO "${DATABASE_USER}";
        //   ALTER DATABASE "${DATABASE_NAME}" OWNER TO "${DATABASE_USER}";
        // `);
      }
    }

    await client.end();

    client = new Client({
      host: DATABASE_HOST,
      user: 'postgres',
      password: POSTGRES_PASSWORD,
      database: DATABASE_NAME,
    });

    await client.connect();

    // SCHEMA:
    //-----------------------------------------------------------------------------------
    const schemaExists = await client.query<{ exists: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = $1) AS exists`,
      [DATABASE_SCHEMA],
    );
    if (!schemaExists.rows[0].exists) {
      print(colorString(defaultColor, 'Creating SCHEMA'), format(DATABASE_SCHEMA) + etc);
      await client.query(`
        CREATE SCHEMA "${DATABASE_SCHEMA}";
        GRANT USAGE, CREATE ON SCHEMA "${DATABASE_SCHEMA}" TO "${DATABASE_USER}";
      `);
    } else {
      // console.log(`Schema "${DATABASE_SCHEMA}" exists. Verifying access for "${DATABASE_USER}"...`);
      const ownerCheck = await client.query<{ owner: string }>(
        `SELECT nspowner::regrole::text AS owner 
         FROM pg_namespace 
         WHERE nspname = $1`,
        [DATABASE_SCHEMA],
      );
      if (ownerCheck.rows.length > 0) {
        const currentOwner = ownerCheck.rows[0].owner;
        if (currentOwner !== DATABASE_USER) {
          const schemaPrivileges = await client.query<{ has_usage: boolean; has_create: boolean }>(
            `SELECT 
              has_schema_privilege($1, $2, 'USAGE') AS has_usage,
              has_schema_privilege($1, $2, 'CREATE') AS has_create`,
            [DATABASE_USER, DATABASE_SCHEMA],
          );
          const { has_usage, has_create } = schemaPrivileges.rows[0];
          if (!has_usage || !has_create) {
            await client.query(`
              GRANT USAGE, CREATE ON SCHEMA "${DATABASE_SCHEMA}" TO "${DATABASE_USER}";
            `);
            print(
              colorString(defaultColor, 'Access granted to'),
              format(DATABASE_USER),
              colorString(defaultColor, 'on schema'),
              format(DATABASE_SCHEMA),
            );
          }

          await client.query(`
            DO $$ BEGIN
              EXECUTE format(
                'GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA %I TO %I;',
                '${DATABASE_SCHEMA}', '${DATABASE_USER}'
              );
              EXECUTE format(
                'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA %I TO %I;',
                '${DATABASE_SCHEMA}', '${DATABASE_USER}'
              );
            END $$;
          `);

          await client.query(`
            ALTER DEFAULT PRIVILEGES IN SCHEMA "${DATABASE_SCHEMA}" GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "${DATABASE_USER}";
            ALTER DEFAULT PRIVILEGES IN SCHEMA "${DATABASE_SCHEMA}" GRANT USAGE, SELECT ON SEQUENCES TO "${DATABASE_USER}";
          `);
        }
      } else {
        console.error(`Unable to determine schema owner for "${DATABASE_SCHEMA}".`);
      }
    }

    await client.end();

    // Check PASSWORD:
    //-----------------------------------------------------------------------------------
    client = new Client({
      host: DATABASE_HOST,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
    });
    await client.connect();

    print(colorString(defaultColor, 'Database initialization complete'));
  } catch (err) {
    console.error(
      formatPrefix(COLOR.red),
      colorString(COLOR.red, 'Error during database initialization:'),
      err.message,
    );
    process.exit(1);
  } finally {
    await client?.end();
  }
}

export default initializeDatabase();
