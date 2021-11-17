/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[matchId]` on the table `UserLeagueMatch`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserLeagueMatch_matchId_unique" ON "UserLeagueMatch"("matchId");
