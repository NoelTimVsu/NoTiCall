/*
  Warnings:

  - The primary key for the `Messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `created_at` on table `Messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Messages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ADD CONSTRAINT "Messages_pkey" PRIMARY KEY ("id");
