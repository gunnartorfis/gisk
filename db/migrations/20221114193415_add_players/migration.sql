-- CreateTable
CREATE TABLE "Player" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "isGoalie" BOOLEAN NOT NULL DEFAULT false,
    "isTopScorer" BOOLEAN NOT NULL DEFAULT false,
    "isGoldenGloveWinner" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
