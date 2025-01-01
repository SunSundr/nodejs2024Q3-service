export function datasourceUrl(): string {
  return (
    `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}` +
    `@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}` +
    `?schema=${process.env.DATABASE_SCHEMA}`
  );
}

export function setDatasourceUrl() {
  process.env.PRISMA_DATABASE_URL = datasourceUrl();
}
