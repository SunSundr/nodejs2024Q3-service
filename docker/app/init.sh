#!/bin/bash

if [ "$ORM_TYPE" != "memory" ]; then
    until nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
        echo "PostgreSQL is not ready yet. Waiting..."
        sleep 2
    done
fi

FLAG_FILE="/app/data/.first_start_flag"

if [ "$ORM_TYPE" = "typeorm" ]; then
    node dist/db/init.js
    if [ $? -ne 0 ]; then
        echo "Error during database initialization. Exiting..."
        exit 0
    fi
    if [ ! -f "$FLAG_FILE" ]; then
        npx typeorm-ts-node-commonjs migration:generate src/typeorm/migrations/InitialMigration -d dist/typeorm/data-source.js --pretty
        LAST_FILE=$(ls -t src/typeorm/migrations/*.ts 2>/dev/null | head -n 1)
        if [ -n "$LAST_FILE" ]; then
            echo "Compiling migrations: $LAST_FILE"
            npx tsc "$LAST_FILE" --outDir dist/typeorm/migrations --strict
        fi
        touch "$FLAG_FILE"
    fi
fi

exec node dist/main.js