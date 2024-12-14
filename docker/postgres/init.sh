#!/bin/bash

# NOT USED NOW

export PGDATA="/var/lib/postgresql/data"

if [ ! -s "$PGDATA/PG_VERSION" ]; then
    echo "Initializing database directory..."
    su - postgres -c "initdb -D \"$PGDATA\""
fi

echo "Starting PostgreSQL..."
su - postgres -c "pg_ctl -D \"$PGDATA\" -l /tmp/postgres.log -w start"

echo "Waiting for PostgreSQL to start..."
until su - postgres -c "pg_isready -q -h localhost -p 5432"; do
    echo "Waiting for PostgreSQL to become ready..."
    sleep 2
done

echo "PostgreSQL is ready. Running initialization script..."

psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = \"$DATABASE_NAME\"" | grep -q 1 || psql -U postgres -c "CREATE DATABASE \"$DATABASE_NAME\""

su - postgres -c "psql -v ON_ERROR_STOP=1 --username postgres --dbname postgres" <<-EOSQL

DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DATABASE_USER') THEN
        CREATE USER "$DATABASE_USER" WITH PASSWORD '$DATABASE_PASSWORD';
    END IF;
END
\$\$;

\connect "$DATABASE_NAME"

DO \$\$
BEGIN
    IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = '$DATABASE_SCHEMA') THEN
        CREATE SCHEMA "$DATABASE_SCHEMA";
    END IF;
END
\$\$;

GRANT USAGE, CREATE ON SCHEMA "$DATABASE_SCHEMA" TO "$DATABASE_USER";
ALTER SCHEMA "$DATABASE_SCHEMA" OWNER TO "$DATABASE_USER";

EOSQL

echo "Configuring PostgreSQL for external access..."
echo "listen_addresses = '*'" >> "$PGDATA/postgresql.conf"
echo "host all all 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"

# Перезагрузите PostgreSQL конфигурацию
# su - postgres -c "pg_ctl -D \"$PGDATA\" reload"

echo "Restarting PostgreSQL to ensure readiness..."
su - postgres -c "pg_ctl -D \"$PGDATA\" stop"
exec su - postgres -c "postgres -D \"$PGDATA\""

# psql -v ON_ERROR_STOP=1 --username "$DATABASE_HOST" --dbname "$DATABASE_HOST" <<-EOSQL
#     CREATE USER "$DATABASE_USER" WITH PASSWORD '$DATABASE_PASSWORD';
#     CREATE DATABASE "$DATABASE_NAME";
#     GRANT ALL PRIVILEGES ON DATABASE "$DATABASE_NAME" TO "$DATABASE_USER";

#     \c "$DATABASE_NAME" "$DATABASE_USER"

#     CREATE SCHEMA "$DATABASE_SCHEMA";
#     GRANT USAGE, CREATE ON SCHEMA "$DATABASE_SCHEMA" TO "$DATABASE_USER";
#     ALTER SCHEMA "$DATABASE_SCHEMA" OWNER TO "$DATABASE_USER";

#     SET search_path TO "$DATABASE_SCHEMA";
# EOSQL