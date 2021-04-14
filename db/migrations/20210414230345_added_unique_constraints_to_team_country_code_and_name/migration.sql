/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[name]` on the table `Team`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[countryCode]` on the table `Team`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team.name_unique" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team.countryCode_unique" ON "Team"("countryCode");
