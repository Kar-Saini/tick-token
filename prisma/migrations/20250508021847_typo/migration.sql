/*
  Warnings:

  - You are about to drop the column `totalTotalSupply` on the `TokenDetails` table. All the data in the column will be lost.
  - Added the required column `totalSupply` to the `TokenDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenDetails" DROP COLUMN "totalTotalSupply",
ADD COLUMN     "totalSupply" INTEGER NOT NULL;
