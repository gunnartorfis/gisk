/*
  Warnings:

  - You are about to drop the column `pending` on the `UserLeague` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "League" DROP CONSTRAINT "League_id_fkey";

-- AlterTable
ALTER TABLE "UserLeague" DROP COLUMN "pending";
