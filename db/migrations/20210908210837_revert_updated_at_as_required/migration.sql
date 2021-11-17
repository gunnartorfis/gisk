/*
  Warnings:

  - Made the column `updatedAt` on table `League` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Match` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Session` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Team` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Token` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `UserLeagueMatch` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "League" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserLeagueMatch" ALTER COLUMN "updatedAt" SET NOT NULL;
