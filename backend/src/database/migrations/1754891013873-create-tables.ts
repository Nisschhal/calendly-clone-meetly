import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1754891013873 implements MigrationInterface {
    name = 'CreateTables1754891013873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."events_locationtype_enum" RENAME TO "events_locationtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."events_locationtype_enum" AS ENUM('GOOGLE_MEET_AND_CALENDAR', 'ZOOM_MEETING')`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "locationType" TYPE "public"."events_locationtype_enum" USING "locationType"::"text"::"public"."events_locationtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."events_locationtype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."events_locationtype_enum_old" AS ENUM('GOOGLE_MEET_AND_CALENDER', 'ZOOM_MEETING')`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "locationType" TYPE "public"."events_locationtype_enum_old" USING "locationType"::"text"::"public"."events_locationtype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."events_locationtype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."events_locationtype_enum_old" RENAME TO "events_locationtype_enum"`);
    }

}
