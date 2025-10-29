/*
  Warnings:

  - You are about to drop the column `cyclesId` on the `study_sessions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "study_sessions" DROP CONSTRAINT "study_sessions_cyclesId_fkey";

-- AlterTable
ALTER TABLE "study_sessions" DROP COLUMN "cyclesId",
ADD COLUMN     "cycleId" TEXT;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
