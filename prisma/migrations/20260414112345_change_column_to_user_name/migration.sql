/*
  Warnings:

  - You are about to drop the column `userId` on the `clear_times` table. All the data in the column will be lost.
  - Added the required column `userName` to the `clear_times` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clear_times" DROP COLUMN "userId",
ADD COLUMN     "userName" TEXT NOT NULL;
