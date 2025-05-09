/*
  Warnings:

  - You are about to drop the column `qrString` on the `Token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "qrString";

-- AlterTable
ALTER TABLE "TokenDetails" ADD COLUMN     "qrString" TEXT;
