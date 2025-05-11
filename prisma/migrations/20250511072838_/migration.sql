/*
  Warnings:

  - You are about to drop the column `allMinted` on the `TokenDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TokenDetails" DROP COLUMN "allMinted",
ADD COLUMN     "allClaimed" BOOLEAN NOT NULL DEFAULT false;
