/*
  Warnings:

  - You are about to drop the column `arrivalTrainNumber` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `departureTrainNumber` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `arrivalTrainId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureTrainId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "arrivalTrainNumber",
DROP COLUMN "departureTrainNumber",
ADD COLUMN     "arrivalTrainId" INTEGER NOT NULL,
ADD COLUMN     "departureTrainId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_departureTrainId_fkey" FOREIGN KEY ("departureTrainId") REFERENCES "Train"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_arrivalTrainId_fkey" FOREIGN KEY ("arrivalTrainId") REFERENCES "Train"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
