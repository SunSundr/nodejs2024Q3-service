import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1731792604641 implements MigrationInterface {
    name = 'InitialMigration1731792604641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nodejs2024schema"."user" ("id" uuid NOT NULL, "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL, "createdAt" bigint NOT NULL, "updatedAt" bigint NOT NULL, CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nodejs2024schema"."track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying, "favorite" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "artistId" character varying, "albumId" character varying, "duration" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nodejs2024schema"."artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying, "favorite" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "grammy" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nodejs2024schema"."album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying, "favorite" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "year" integer, "artistId" character varying, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "nodejs2024schema"."album"`);
        await queryRunner.query(`DROP TABLE "nodejs2024schema"."artist"`);
        await queryRunner.query(`DROP TABLE "nodejs2024schema"."track"`);
        await queryRunner.query(`DROP TABLE "nodejs2024schema"."user"`);
    }

}
