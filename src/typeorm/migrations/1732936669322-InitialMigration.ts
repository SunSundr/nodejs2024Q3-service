import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732936669322 implements MigrationInterface {
    name = 'InitialMigration1732936669322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "nodejs2024schema"."user" (
                "id" uuid NOT NULL,
                "login" character varying NOT NULL,
                "password" character varying(255) NOT NULL,
                "version" integer NOT NULL,
                "createdAt" bigint NOT NULL,
                "updatedAt" bigint NOT NULL,
                CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "nodejs2024schema"."artist" (
                "id" uuid NOT NULL,
                "userId" character varying,
                "favorite" boolean NOT NULL DEFAULT false,
                "name" character varying NOT NULL,
                "grammy" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "nodejs2024schema"."album" (
                "id" uuid NOT NULL,
                "userId" character varying,
                "favorite" boolean NOT NULL DEFAULT false,
                "name" character varying NOT NULL,
                "year" integer,
                "artistId" uuid,
                CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "nodejs2024schema"."track" (
                "id" uuid NOT NULL,
                "userId" character varying,
                "favorite" boolean NOT NULL DEFAULT false,
                "name" character varying NOT NULL,
                "artistId" uuid,
                "albumId" uuid,
                "duration" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "nodejs2024schema"."album"
            ADD CONSTRAINT "FK_3d06f25148a4a880b429e3bc839" FOREIGN KEY ("artistId") REFERENCES "nodejs2024schema"."artist"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "nodejs2024schema"."track"
            ADD CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2" FOREIGN KEY ("artistId") REFERENCES "nodejs2024schema"."artist"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "nodejs2024schema"."track"
            ADD CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") REFERENCES "nodejs2024schema"."album"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "nodejs2024schema"."track" DROP CONSTRAINT "FK_b105d945c4c185395daca91606a"
        `);
        await queryRunner.query(`
            ALTER TABLE "nodejs2024schema"."track" DROP CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2"
        `);
        await queryRunner.query(`
            ALTER TABLE "nodejs2024schema"."album" DROP CONSTRAINT "FK_3d06f25148a4a880b429e3bc839"
        `);
        await queryRunner.query(`
            DROP TABLE "nodejs2024schema"."track"
        `);
        await queryRunner.query(`
            DROP TABLE "nodejs2024schema"."album"
        `);
        await queryRunner.query(`
            DROP TABLE "nodejs2024schema"."artist"
        `);
        await queryRunner.query(`
            DROP TABLE "nodejs2024schema"."user"
        `);
    }

}
