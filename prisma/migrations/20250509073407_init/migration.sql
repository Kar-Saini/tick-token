/*
  Warnings:

  - You are about to drop the column `address` on the `TokenDetails` table. All the data in the column will be lost.
  - Added the required column `mintingWalletAddress` to the `TokenDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerAddress` to the `TokenDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenDetails" DROP COLUMN "address",
ADD COLUMN     "mintingWalletAddress" TEXT NOT NULL,
ADD COLUMN     "ownerAddress" TEXT NOT NULL;
