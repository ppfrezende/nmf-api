/*
  Warnings:

  - You are about to drop the column `pages_readed` on the `disciplines` table. All the data in the column will be lost.
  - You are about to drop the column `reading_duration_sec` on the `disciplines` table. All the data in the column will be lost.
  - You are about to drop the column `right_questions` on the `disciplines` table. All the data in the column will be lost.
  - You are about to drop the column `wrong_questions` on the `disciplines` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "disciplines" DROP COLUMN "pages_readed",
DROP COLUMN "reading_duration_sec",
DROP COLUMN "right_questions",
DROP COLUMN "wrong_questions";

-- AlterTable
ALTER TABLE "study_sessions" ADD COLUMN     "performance_percentage" DECIMAL(20,2),
ADD COLUMN     "total_studing_duration_sec" INTEGER DEFAULT 0;
