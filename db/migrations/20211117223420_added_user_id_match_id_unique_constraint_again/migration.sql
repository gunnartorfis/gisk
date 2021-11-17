/*
  Warnings:

  - A unique constraint covering the columns `[userId,matchId]` on the table `UserLeagueMatch` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserLeagueMatch_userId_matchId_key" ON "UserLeagueMatch"("userId", "matchId");
