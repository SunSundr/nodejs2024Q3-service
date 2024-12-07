export const SWAGGER_USE_DEFAULT_SCHEMA = true;
export const SWAGGER_PATH = 'api/doc/doc';
export const APP_NAME = 'Home Library Service';
export const ENV_LOADED = 'ENV_LOADED';
export const JWT_DEFAULT = {
  tokenExpireTime: '1h',
  tokenRefreshExpireTime: '24h',
  defaultSecret: 'fakeSecret',
};
export const LOG_DEFAULT = {
  logLevel: 3,
  logFolder: 'logs',
  logFileName: 'app.log',
  errorFileName: 'error.log',
  fileMaxSizeKB: 512,
};
export const TEST_USER_DTO = {
  login: 'TEST_AUTH_LOGIN',
  password: 'Tu6!@#%&',
};

export function envCongig(): { [key: string]: string | number | boolean } {
  return {
    PORT: parseInt(process.env.PORT, 10),
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT, 10),
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_CONTAINER_HOST: process.env.DATABASE_CONTAINER_HOST,
    DATABASE_PORT: parseInt(process.env.DATABASE_PORT, 10),
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_SCHEMA: process.env.DATABASE_SCHEMA,
    CONTAINER_NAME_APP: process.env.CONTAINER_NAME_APP,
    CONTAINER_NAME_DB: process.env.CONTAINER_NAME_DB,
    COMPOSE_PROJECT_NAME: process.env.COMPOSE_PROJECT_NAME,
    TYPEORM_LOGGING: process.env.TYPEORM_LOGGING === 'true',
    TYPEORM_DROPSCHEMA: process.env.TYPEORM_DROPSCHEMA === 'true',
    TYPEORM_SYNCHRONIZE: process.env.TYPEORM_SYNCHRONIZE === 'true',
    CRYPT_SALT: parseInt(process.env.CRYPT_SALT, 10),
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || JWT_DEFAULT.defaultSecret,
    JWT_SECRET_REFRESH_KEY: process.env.JWT_SECRET_REFRESH_KEY,
    TOKEN_EXPIRE_TIME: process.env.TOKEN_EXPIRE_TIME || JWT_DEFAULT.tokenExpireTime,
    TOKEN_REFRESH_EXPIRE_TIME:
      process.env.TOKEN_REFRESH_EXPIRE_TIME || JWT_DEFAULT.tokenRefreshExpireTime,
    LOG_FILE_MAX_SIZE_KB: (() => {
      const size = parseInt(process.env.LOG_FILE_MAX_SIZE_KB, 10);
      return size > 0 ? size : LOG_DEFAULT.fileMaxSizeKB;
    })(),
    LOG_LEVEL: (() => {
      const level = parseInt(process.env.LOG_LEVEL, 10);
      return level >= 0 && level <= 5 ? level : LOG_DEFAULT.logLevel;
    })(),
    LOG_VERBOSE_STACK: (() => {
      return process.env.LOG_VERBOSE_STACK === 'true';
    })(),
    ORM_TYPE: process.env.ORM_TYPE,
    ENV_LOADED: process.env.ENV_LOADED === 'true',
  };
}
