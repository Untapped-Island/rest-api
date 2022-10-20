/*
  Warnings:

  - The primary key for the `CardsOnPlayers` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CardsOnPlayers" DROP CONSTRAINT "CardsOnPlayers_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CardsOnPlayers_pkey" PRIMARY KEY ("id");
