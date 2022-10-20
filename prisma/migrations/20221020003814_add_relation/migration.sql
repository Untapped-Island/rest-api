-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullType" TEXT NOT NULL,
    "power" DOUBLE PRECISION,
    "toughness" DOUBLE PRECISION,
    "manaCost" TEXT,
    "manaValue" DOUBLE PRECISION NOT NULL,
    "colors" INTEGER NOT NULL,
    "colorIdentity" INTEGER NOT NULL,
    "formats" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardsOnPlayers" (
    "cardId" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "isFoil" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CardsOnPlayers_pkey" PRIMARY KEY ("cardId","playerId")
);

-- CreateTable
CREATE TABLE "SubType" (
    "id" TEXT NOT NULL,

    CONSTRAINT "SubType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuperType" (
    "id" TEXT NOT NULL,

    CONSTRAINT "SuperType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CardToSubType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CardToSuperType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CardToType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_name_key" ON "Card"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CardToSubType_AB_unique" ON "_CardToSubType"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToSubType_B_index" ON "_CardToSubType"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CardToSuperType_AB_unique" ON "_CardToSuperType"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToSuperType_B_index" ON "_CardToSuperType"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CardToType_AB_unique" ON "_CardToType"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToType_B_index" ON "_CardToType"("B");

-- AddForeignKey
ALTER TABLE "CardsOnPlayers" ADD CONSTRAINT "CardsOnPlayers_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardsOnPlayers" ADD CONSTRAINT "CardsOnPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToSubType" ADD CONSTRAINT "_CardToSubType_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToSubType" ADD CONSTRAINT "_CardToSubType_B_fkey" FOREIGN KEY ("B") REFERENCES "SubType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToSuperType" ADD CONSTRAINT "_CardToSuperType_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToSuperType" ADD CONSTRAINT "_CardToSuperType_B_fkey" FOREIGN KEY ("B") REFERENCES "SuperType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToType" ADD CONSTRAINT "_CardToType_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToType" ADD CONSTRAINT "_CardToType_B_fkey" FOREIGN KEY ("B") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
