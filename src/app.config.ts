export const SWAGGER_USE_DEFAULT_SCHEMA = true;
export const SWAGGER_PATH = 'api/doc/doc';
export const APP_NAME = 'Home Library Service';

export const JWT_DEFAULT = {
  tokenExpireTime: '1h',
  tokenRefreshExpireTime: '24h',
  defaultSecret: 'fakeSecret',
};

export const LOG_DEFAULT = {
  logLevel: 3,
  logFolder: 'logs',
  logFileName: 'APP',
  errorFileName: 'ERR',
  logExtName: 'log',
  fileMaxSizeKB: 512,
  folderMaxSizeMB: 10,
  claenupPercent: 20,
  maxFileAgeDays: 3,
};
