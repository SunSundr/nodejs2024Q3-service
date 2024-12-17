#!/bin/bash

if [ "$ORM_TYPE" != "memory" ]; then
    until nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
        echo "PostgreSQL is not ready yet. Waiting..."
        sleep 2
    done
fi

exit_on_error() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo "Error occurred (exit code: $exit_code). Exiting..."
        exit 0
    fi
}

FLAG_FILE="/app/dist/typeorm/migrations/.first_start_flag"

if [ "$ORM_TYPE" = "typeorm" ]; then
    node dist/db/init.js
    exit_on_error
    if [ ! -f "$FLAG_FILE" ]; then
        echo "Generate initial migrations..."
        npx typeorm-ts-node-commonjs migration:generate src/typeorm/migrations/InitialMigration -d dist/typeorm/data-source.js --pretty
        exit_on_error

        LAST_FILE=$(ls -t src/typeorm/migrations/*.ts 2>/dev/null | head -n 1)
        if [ -n "$LAST_FILE" ]; then
            echo "Modifying the migration file to work with any current schema..."
            node -e "require(\"./dist/typeorm/migration.replace.js\").migrationReplace(\"$LAST_FILE\")"
            exit_on_error

            echo "Compiling migrations: $LAST_FILE"
            npx tsc "$LAST_FILE" --outDir dist/typeorm/migrations --target es2017 --module commonjs --declaration --declarationMap --strict
            exit_on_error

            touch "$FLAG_FILE"
        fi
    fi
fi

exec node dist/main.js