/*
  Warnings:

  - Made the column `adjustedPrice` on table `Train` required. This step will fail if there are existing NULL values in that column.
  - Made the column `basePrice` on table `Train` required. This step will fail if there are existing NULL values in that column.
  - Made the column `finalPrice` on table `Train` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gstTaxAmount` on table `Train` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trainName` on table `Train` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Train" ALTER COLUMN "adjustedPrice" SET NOT NULL,
ALTER COLUMN "basePrice" SET NOT NULL,
ALTER COLUMN "finalPrice" SET NOT NULL,
ALTER COLUMN "gstTaxAmount" SET NOT NULL,
ALTER COLUMN "trainName" SET NOT NULL;
