import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1754237369647 implements MigrationInterface {
    name = 'CreateTables1754237369647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "duration" integer NOT NULL DEFAULT '30'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "duration"`);
    }

}
