import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1704067200000 implements MigrationInterface {
    name = 'InitialMigration1704067200000'
    schema = process.env.DATABASE_SCHEMA

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "${this.schema}"."user" (
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
            CREATE TABLE "${this.schema}"."artist" (
                "id" uuid NOT NULL,
                "userId" uuid,
                "favorite" boolean NOT NULL DEFAULT false,
                "name" character varying NOT NULL,
                "grammy" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "${this.schema}"."album" (
                "id" uuid NOT NULL,
                "userId" uuid,
                "favorite" boolean NOT NULL DEFAULT false,
                "name" character varying NOT NULL,
                "year" integer,
                "artistId" uuid,
                CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "${this.schema}"."track" (
                "id" uuid NOT NULL,
                "userId" uuid,
                "favorite" boolean NOT NULL DEFAULT false,
                "name" character varying NOT NULL,
                "artistId" uuid,
                "albumId" uuid,
                "duration" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "${this.schema}"."artist"
            ADD CONSTRAINT "FK_3c2c776c0a094c15d6c165494c0" FOREIGN KEY ("userId") REFERENCES "${this.schema}"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "${this.schema}"."album"
            ADD CONSTRAINT "FK_815bbf84cb5e82a56c85294d0fe" FOREIGN KEY ("userId") REFERENCES "${this.schema}"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "${this.schema}"."album"
            ADD CONSTRAINT "FK_3d06f25148a4a880b429e3bc839" FOREIGN KEY ("artistId") REFERENCES "${this.schema}"."artist"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "${this.schema}"."track"
            ADD CONSTRAINT "FK_92ddd84d4282ef453317fcd5529" FOREIGN KEY ("userId") REFERENCES "${this.schema}"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "${this.schema}"."track"
            ADD CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2" FOREIGN KEY ("artistId") REFERENCES "${this.schema}"."artist"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "${this.schema}"."track"
            ADD CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") REFERENCES "${this.schema}"."album"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "${this.schema}"."track" DROP CONSTRAINT "FK_b105d945c4c185395daca91606a"
        `);
        await queryRunner.query(`
            ALTER TABLE "${this.schema}"."track" DROP CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2"
        `);
        await queryRunner.query(`
            ALTER TABLE "${this.schema}"."track" DROP CONSTRAINT "FK_92ddd84d4282ef453317fcd5529"
        `);
        await queryRunner.query(`
            ALTER TABLE "${this.schema}"."album" DROP CONSTRAINT "FK_3d06f25148a4a880b429e3bc839"
        `);
        await queryRunner.query(`
            ALTER TABLE "${this.schema}"."album" DROP CONSTRAINT "FK_815bbf84cb5e82a56c85294d0fe"
        `);
        await queryRunner.query(`
            ALTER TABLE "${this.schema}"."artist" DROP CONSTRAINT "FK_3c2c776c0a094c15d6c165494c0"
        `);
        await queryRunner.query(`
            DROP TABLE "${this.schema}"."track"
        `);
        await queryRunner.query(`
            DROP TABLE "${this.schema}"."album"
        `);
        await queryRunner.query(`
            DROP TABLE "${this.schema}"."artist"
        `);
        await queryRunner.query(`
            DROP TABLE "${this.schema}"."user"
        `);
    }

}
