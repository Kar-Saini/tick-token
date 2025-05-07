/*
  Warnings:

  - Added the required column `merkleTreeAddress` to the `TokenDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenDetails" ADD COLUMN     "merkleTreeAddress" TEXT NOT NULL;
