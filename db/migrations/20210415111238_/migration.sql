/*
  Warnings:

  - You are about to drop the column `result1` on the `UserLeagueMatch` table. All the data in the column will be lost.
  - You are about to drop the column `resultX` on the `UserLeagueMatch` table. All the data in the column will be lost.
  - You are about to drop the column `result2` on the `UserLeagueMatch` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[homeTeamId,awayTeamId,kickOff]` on the table `Match`. If there are existing duplicate values, the migration will fail.
  - Added the required column `resultHome` to the `UserLeagueMatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resultAway` to the `UserLeagueMatch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserLeagueMatch" DROP COLUMN "result1",
DROP COLUMN "resultX",
DROP COLUMN "result2",
ADD COLUMN     "resultHome" INTEGER NOT NULL,
ADD COLUMN     "resultAway" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Match.homeTeamId_awayTeamId_kickOff_unique" ON "Match"("homeTeamId", "awayTeamId", "kickOff");
