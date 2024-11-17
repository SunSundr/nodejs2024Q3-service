CREATE USER nodejs2024q3 WITH PASSWORD '5106';
CREATE DATABASE "nodejs2024q3-typeorm";
GRANT ALL PRIVILEGES ON DATABASE "nodejs2024q3-typeorm" TO nodejs2024q3;

\c "nodejs2024q3-typeorm" nodejs2024q3

CREATE SCHEMA nodejs2024schema;
GRANT USAGE, CREATE ON SCHEMA nodejs2024schema TO nodejs2024q3;
ALTER SCHEMA nodejs2024schema OWNER TO nodejs2024q3;

SET search_path TO nodejs2024schema;
