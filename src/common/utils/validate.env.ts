import { COLOR, colorString } from './color';

export enum OrmTypes {
  MEMORY = 'memory',
  TYPEORM = 'typeorm',
  PRISMA = 'prisma',
}

export function validateEnv(config: Record<string, string | OrmTypes>) {
  const requiredVariables = [
    // 'PORT', // checked in docker-compose.yml
    // 'POSTGRES_PORT', // checked in docker-compose.yml
    // 'DATABASE_PORT', // checked in docker-compose.yml
    'POSTGRES_PASSWORD',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
    'DATABASE_SCHEMA',
    'CRYPT_SALT',
    'JWT_SECRET_KEY',
    'JWT_SECRET_REFRESH_KEY',
    'ORM_TYPE',
  ];

  for (const variable of requiredVariables) {
    if (!config[variable]) {
      console.error(
        colorString(COLOR.red, 'Missing required environment variable:'),
        colorString(COLOR.yellow, variable),
      );
      process.exit(0);
    }
  }

  // ['PORT', 'POSTGRES_PORT', 'DATABASE_PORT', 'CRYPT_SALT'].forEach((key) => {
  ['CRYPT_SALT'].forEach((key) => {
    if (isNaN(Number(config[key]))) {
      console.error(`Invalid value for ${key}: must be a number`);
      console.error(
        colorString(COLOR.red, 'Invalid value for '),
        colorString(COLOR.yellow, key),
        colorString(COLOR.red, ': must be a number'),
      );
      process.exit(0);
    }
  });

  const validOrmTypes = [OrmTypes.MEMORY, OrmTypes.TYPEORM, OrmTypes.PRISMA];
  if (!validOrmTypes.includes(config.ORM_TYPE as OrmTypes)) {
    console.error(
      colorString(COLOR.red, 'Invalid value for ORM_TYPE: must be one of '),
      colorString(COLOR.yellow, validOrmTypes.join(', ')),
    );
    process.exit(0);
  }

  return config;
}
