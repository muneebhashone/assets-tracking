/*
  Warnings:

  - You are about to drop the column `arivalTime` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `shipment` on the `Shipment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,tracking_number]` on the table `Shipment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aggregator` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arrivalTime` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sealine` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tracking_number` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ROLE" ADD VALUE 'SUPER_ADMIN';

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "arivalTime",
DROP COLUMN "reference",
DROP COLUMN "shipment",
ADD COLUMN     "aggregator" TEXT NOT NULL,
ADD COLUMN     "arrivalTime" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sealine" TEXT NOT NULL,
ADD COLUMN     "tracking_number" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "Vessel" (
    "id" SERIAL NOT NULL,
    "fid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "shipment_id" INTEGER NOT NULL,

    CONSTRAINT "Vessel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_userId_tracking_number_key" ON "Shipment"("userId", "tracking_number");

-- CreateIndex
CREATE INDEX "User_companyId_idx" ON "User"("companyId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
