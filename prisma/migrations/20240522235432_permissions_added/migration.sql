/*
  Warnings:

  - The `permissions` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PERMISSIONS" AS ENUM ('VIEW_SHIPMENT', 'CREATE_SHIPMENT', 'EDIT_SHIPMENT', 'DELETE_SHIPMENT', 'VIEW_USER', 'CREATE_USER', 'EDIT_USER', 'DELETE_USER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "permissions",
ADD COLUMN     "permissions" "PERMISSIONS"[] DEFAULT ARRAY[]::"PERMISSIONS"[];
