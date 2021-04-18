-- AlterTable
ALTER TABLE "User" ADD COLUMN     "language" TEXT;

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question" TEXT NOT NULL,
    "answer" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestionTranslation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "language" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "quizQuestionId" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuizQuestion" (
    "userId" UUID NOT NULL,
    "quizQuestionId" UUID NOT NULL,
    "answer" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "UserQuizQuestion.userId_quizQuestionId_unique" ON "UserQuizQuestion"("userId", "quizQuestionId");

-- AddForeignKey
ALTER TABLE "QuizQuestionTranslation" ADD FOREIGN KEY ("quizQuestionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizQuestion" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizQuestion" ADD FOREIGN KEY ("quizQuestionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
