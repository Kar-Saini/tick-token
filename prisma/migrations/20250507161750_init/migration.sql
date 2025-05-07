-- CreateTable
CREATE TABLE "TokenDetails" (
    "id" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "totalTotalSupply" INTEGER NOT NULL,
    "totalClaimedToken" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "qrString" TEXT NOT NULL,
    "tokenDetailsId" TEXT NOT NULL,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "claimedBy" TEXT,
    "claimedAt" TIMESTAMP(3),

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDescription" TEXT,
    "eventDate" TIMESTAMP(3),
    "tokenDetailsId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenDetails_id_key" ON "TokenDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Token_id_key" ON "Token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "Event"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_tokenDetailsId_key" ON "Event"("tokenDetailsId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_tokenDetailsId_fkey" FOREIGN KEY ("tokenDetailsId") REFERENCES "TokenDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tokenDetailsId_fkey" FOREIGN KEY ("tokenDetailsId") REFERENCES "TokenDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
