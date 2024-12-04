#!/bin/sh
if [ "$ORM_TYPE" != "memory" ]; then
    until nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
        echo "PostgreSQL is not ready yet. Waiting..."
        sleep 2
    done
fi

FLAG_FILE="/app/.first_start_flag"

if [ "$ORM_TYPE" = "typeorm" ]; then
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

node dist/main.js