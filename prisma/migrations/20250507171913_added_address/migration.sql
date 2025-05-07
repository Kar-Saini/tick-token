/*
  Warnings:

  - Added the required column `address` to the `TokenDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenDetails" ADD COLUMN     "address" TEXT NOT NULL;
