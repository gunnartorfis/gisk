-- AlterTable
ALTER TABLE "QuizQuestionTranslation" ADD COLUMN     "useGoalies" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "usePlayers" BOOLEAN NOT NULL DEFAULT false;
