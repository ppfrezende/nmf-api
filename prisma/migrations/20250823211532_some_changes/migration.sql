/*
  Warnings:

  - You are about to drop the column `projectId` on the `cycles` table. All the data in the column will be lost.
  - You are about to drop the column `cycleId` on the `disciplines` table. All the data in the column will be lost.
  - You are about to drop the column `pages_readed` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the column `question_platform_link` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the column `question_status` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the column `right_questions` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the column `scanning_reading_duration_sec` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the column `skimming_reading_duration_sec` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the column `study_method` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the column `theory_status` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the column `view_at` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the column `wrong_questions` on the `topics` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cycles" DROP CONSTRAINT "cycles_projectId_fkey";

-- DropForeignKey
ALTER TABLE "disciplines" DROP CONSTRAINT "disciplines_cycleId_fkey";

-- DropIndex
DROP INDEX "cycles_projectId_idx";

-- DropIndex
DROP INDEX "disciplines_cycleId_idx";

-- AlterTable
ALTER TABLE "cycles" DROP COLUMN "projectId",
ADD COLUMN     "pages_readed" INTEGER DEFAULT 0,
ADD COLUMN     "question_platform_link" TEXT,
ADD COLUMN     "question_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "right_questions" INTEGER DEFAULT 0,
ADD COLUMN     "scanning_reading_duration_sec" INTEGER DEFAULT 0,
ADD COLUMN     "skimming_reading_duration_sec" INTEGER DEFAULT 0,
ADD COLUMN     "study_method" TEXT,
ADD COLUMN     "theory_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "topicId" TEXT,
ADD COLUMN     "view_at" TIMESTAMP(3),
ADD COLUMN     "wrong_questions" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "disciplines" DROP COLUMN "cycleId",
ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "topics" DROP COLUMN "pages_readed",
DROP COLUMN "question_platform_link",
DROP COLUMN "question_status",
DROP COLUMN "right_questions",
DROP COLUMN "scanning_reading_duration_sec",
DROP COLUMN "skimming_reading_duration_sec",
DROP COLUMN "study_method",
DROP COLUMN "theory_status",
DROP COLUMN "view_at",
DROP COLUMN "wrong_questions";

-- CreateIndex
CREATE INDEX "cycles_topicId_idx" ON "cycles"("topicId");

-- CreateIndex
CREATE INDEX "disciplines_projectId_idx" ON "disciplines"("projectId");

-- AddForeignKey
ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
