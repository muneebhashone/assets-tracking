-- CreateEnum
CREATE TYPE "Status" AS ENUM ('true', 'false');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "ROLE" NOT NULL DEFAULT 'USER',
    "status" "Status" NOT NULL DEFAULT 'false',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
