#!/bin/bash

exit_on_error() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo "Error occurred (exit code: $exit_code). Exiting..."
        exit 0
    fi
}

print_banner() {
    echo -e "╔═══════════════════════════╗\n║ HOME LIBRARY SERVICE 2024 ║\n╚═══════════════════════════╝"
}

FLAG_FIRST_START="/app/startup/.initialized"

if [ "$ORM_TYPE" != "memory" ]; then
    until echo "SELECT 1" | nc "$DATABASE_HOST" "$DATABASE_PORT" > /dev/null 2>&1; do
        echo "PostgreSQL is not ready yet. Waiting..."
        sleep 2
    done

    print_banner

    node dist/db/init.js
    exit_on_error

    first_start=false
    if [ ! -f "$FLAG_FIRST_START" ]; then
        first_start=true
    fi

    #------------------------------FIRST START-----------------------------------------------------
    if $first_start; then
        # https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux

        echo -e "\n\033[4;35m Generating initial PRISMA migration... \x1b[0m\xEF\xBB\xBF"
        npx prisma generate
        exit_on_error
        node -e "require(\"./dist/prisma/migration.generate.js\").migrationGenerate()"
        exit_on_error


        echo -e "\n\033[4;35m Generating initial TYPEORM migration... \x1b[0m\xEF\xBB\xBF"
        node -e "require('./dist/typeorm/migration.generate.js').migrationGenerate()"
        exit_on_error

        touch "$FLAG_FIRST_START"
    fi

    #----------------------------------------------------------------------------------------------
    if [ "$ORM_TYPE" = "prisma" ]; then
        node -e "require(\"./dist/prisma/migration.generate.js\").migrationCheck($first_start)"
        exit_on_error
        node -e "require(\"./dist/typeorm/migration.check.js\").checkLatestMigration()" # Sync with TypeORM
        exit_on_error
    elif [ "$ORM_TYPE" = "typeorm" ]; then
        node -e "require(\"./dist/prisma/migration.check.js\").checkLatestMigration()" # Sync with Prisma
        exit_on_error
    fi
else
    print_banner
fi

exec node dist/main.js