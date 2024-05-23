/*
  Warnings:

  - You are about to drop the column `userId` on the `Shipment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyId,tracking_number,creatorId]` on the table `Shipment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_userId_fkey";

-- DropIndex
DROP INDEX "Shipment_userId_tracking_number_key";

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "userId",
ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "creatorId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_companyId_tracking_number_creatorId_key" ON "Shipment"("companyId", "tracking_number", "creatorId");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
