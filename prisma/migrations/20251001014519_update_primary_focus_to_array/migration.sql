/*
  Warnings:

  - Changed the column `primary_focus` on the `users` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable: First drop default, then convert data type, then set new default
ALTER TABLE "public"."users" ALTER COLUMN "primary_focus" DROP DEFAULT;

ALTER TABLE "public"."users"
ALTER COLUMN "primary_focus" SET DATA TYPE "public"."Focus"[] USING ARRAY[primary_focus]::"public"."Focus"[];

ALTER TABLE "public"."users"
ALTER COLUMN "primary_focus" SET DEFAULT ARRAY['GENERAL']::"public"."Focus"[];
