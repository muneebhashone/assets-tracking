/*
  Warnings:

  - You are about to drop the column `credits` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "credits" INTEGER DEFAULT 0,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "industry" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "credits";
