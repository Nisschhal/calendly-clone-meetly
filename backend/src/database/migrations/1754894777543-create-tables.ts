import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1754894777543 implements MigrationInterface {
    name = 'CreateTables1754894777543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration" DROP CONSTRAINT "FK_68a2ec8d07dd827da8d67d6560e"`);
        await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "integration" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "integration" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "integration" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "integration" ADD CONSTRAINT "FK_e38baca49ddff880b963fcb5d08" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration" DROP CONSTRAINT "FK_e38baca49ddff880b963fcb5d08"`);
        await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "integration" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "integration" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "integration" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "integration" ADD CONSTRAINT "FK_68a2ec8d07dd827da8d67d6560e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
