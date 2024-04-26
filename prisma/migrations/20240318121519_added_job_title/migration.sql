-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credits" INTEGER DEFAULT 0,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
