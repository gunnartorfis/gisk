/*
  Warnings:

  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGroupMatch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_id_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserGroupMatch" DROP CONSTRAINT "UserGroupMatch_id_fkey";

-- DropForeignKey
ALTER TABLE "UserGroupMatch" DROP CONSTRAINT "UserGroupMatch_id_fkey1";

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "UserGroup";

-- DropTable
DROP TABLE "UserGroupMatch";

-- CreateTable
CREATE TABLE "UserLeague" (
    "userId" INTEGER NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT E'USER',
    "pending" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","leagueId")
);

-- CreateTable
CREATE TABLE "League" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "inviteCode" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLeagueMatch" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "result1" INTEGER NOT NULL,
    "resultX" INTEGER NOT NULL,
    "result2" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "League.inviteCode_unique" ON "League"("inviteCode");

-- AddForeignKey
ALTER TABLE "UserLeague" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeague" ADD FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "League" ADD FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeagueMatch" ADD FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeagueMatch" ADD FOREIGN KEY ("id") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
