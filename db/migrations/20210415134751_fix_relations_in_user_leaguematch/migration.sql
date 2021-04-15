/*
  Warnings:

  - Added the required column `userId` to the `UserLeagueMatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchId` to the `UserLeagueMatch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_id_fkey1";

-- DropForeignKey
ALTER TABLE "UserLeagueMatch" DROP CONSTRAINT "UserLeagueMatch_id_fkey2";

-- DropForeignKey
ALTER TABLE "UserLeagueMatch" DROP CONSTRAINT "UserLeagueMatch_id_fkey";

-- AlterTable
ALTER TABLE "UserLeagueMatch" ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "matchId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeagueMatch" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeagueMatch" ADD FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
