/*
  Warnings:

  - You are about to drop the `Matrix` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Matrix";

-- CreateTable
CREATE TABLE "clear_times" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "time" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clear_times_pkey" PRIMARY KEY ("id")
);
