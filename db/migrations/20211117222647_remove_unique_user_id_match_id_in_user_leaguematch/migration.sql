-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_homeTeamId_fkey";

-- DropForeignKey
ALTER TABLE "QuizQuestionTranslation" DROP CONSTRAINT "QuizQuestionTranslation_quizQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserLeague" DROP CONSTRAINT "UserLeague_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "UserLeague" DROP CONSTRAINT "UserLeague_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserLeagueMatch" DROP CONSTRAINT "UserLeagueMatch_matchId_fkey";

-- DropForeignKey
ALTER TABLE "UserLeagueMatch" DROP CONSTRAINT "UserLeagueMatch_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizQuestion" DROP CONSTRAINT "UserQuizQuestion_quizQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizQuestion" DROP CONSTRAINT "UserQuizQuestion_userId_fkey";

-- DropIndex
DROP INDEX "UserLeagueMatch.userId_matchId_unique";

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeague" ADD CONSTRAINT "UserLeague_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeague" ADD CONSTRAINT "UserLeague_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestionTranslation" ADD CONSTRAINT "QuizQuestionTranslation_quizQuestionId_fkey" FOREIGN KEY ("quizQuestionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizQuestion" ADD CONSTRAINT "UserQuizQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizQuestion" ADD CONSTRAINT "UserQuizQuestion_quizQuestionId_fkey" FOREIGN KEY ("quizQuestionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeagueMatch" ADD CONSTRAINT "UserLeagueMatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeagueMatch" ADD CONSTRAINT "UserLeagueMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "League.inviteCode_unique" RENAME TO "League_inviteCode_key";

-- RenameIndex
ALTER INDEX "Match.homeTeamId_awayTeamId_kickOff_unique" RENAME TO "Match_homeTeamId_awayTeamId_kickOff_key";

-- RenameIndex
ALTER INDEX "Session.handle_unique" RENAME TO "Session_handle_key";

-- RenameIndex
ALTER INDEX "Team.countryCode_unique" RENAME TO "Team_countryCode_key";

-- RenameIndex
ALTER INDEX "Team.name_unique" RENAME TO "Team_name_key";

-- RenameIndex
ALTER INDEX "Token.hashedToken_type_unique" RENAME TO "Token_hashedToken_type_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "UserLeagueMatch_matchId_unique" RENAME TO "UserLeagueMatch_matchId_key";

-- RenameIndex
ALTER INDEX "UserQuizQuestion.userId_quizQuestionId_unique" RENAME TO "UserQuizQuestion_userId_quizQuestionId_key";
