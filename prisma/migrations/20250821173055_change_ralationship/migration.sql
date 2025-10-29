/*
  Warnings:

  - You are about to drop the column `projectId` on the `disciplines` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the `cycle_disciplines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cycle_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cycle_topics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discipline_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question_attempts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `study_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `topic_stats` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `cycles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `disciplines` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "cycle_disciplines" DROP CONSTRAINT "cycle_disciplines_cycleId_fkey";

-- DropForeignKey
ALTER TABLE "cycle_disciplines" DROP CONSTRAINT "cycle_disciplines_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "cycle_stats" DROP CONSTRAINT "cycle_stats_cycleId_fkey";

-- DropForeignKey
ALTER TABLE "cycle_topics" DROP CONSTRAINT "cycle_topics_cycleDisciplineId_fkey";

-- DropForeignKey
ALTER TABLE "cycle_topics" DROP CONSTRAINT "cycle_topics_cycleId_fkey";

-- DropForeignKey
ALTER TABLE "cycle_topics" DROP CONSTRAINT "cycle_topics_topicId_fkey";

-- DropForeignKey
ALTER TABLE "discipline_stats" DROP CONSTRAINT "discipline_stats_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "disciplines" DROP CONSTRAINT "disciplines_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_stats" DROP CONSTRAINT "project_stats_projectId_fkey";

-- DropForeignKey
ALTER TABLE "question_attempts" DROP CONSTRAINT "question_attempts_cycleId_fkey";

-- DropForeignKey
ALTER TABLE "question_attempts" DROP CONSTRAINT "question_attempts_cycleTopicId_fkey";

-- DropForeignKey
ALTER TABLE "question_attempts" DROP CONSTRAINT "question_attempts_userId_fkey";

-- DropForeignKey
ALTER TABLE "study_sessions" DROP CONSTRAINT "study_sessions_cycleId_fkey";

-- DropForeignKey
ALTER TABLE "study_sessions" DROP CONSTRAINT "study_sessions_cycleTopicId_fkey";

-- DropForeignKey
ALTER TABLE "study_sessions" DROP CONSTRAINT "study_sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "topic_stats" DROP CONSTRAINT "topic_stats_topicId_fkey";

-- DropIndex
DROP INDEX "cycles_projectId_name_key";

-- DropIndex
DROP INDEX "disciplines_projectId_idx";

-- DropIndex
DROP INDEX "disciplines_projectId_name_key";

-- AlterTable
ALTER TABLE "disciplines" DROP COLUMN "projectId",
ADD COLUMN     "cycleId" TEXT;

-- AlterTable
ALTER TABLE "topics" DROP COLUMN "description",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "pages_readed" INTEGER DEFAULT 0,
ADD COLUMN     "question_platform_link" TEXT,
ADD COLUMN     "question_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "right_questions" INTEGER DEFAULT 0,
ADD COLUMN     "scanning_reading_duration_sec" INTEGER DEFAULT 0,
ADD COLUMN     "skimming_reading_duration_sec" INTEGER DEFAULT 0,
ADD COLUMN     "study_method" TEXT,
ADD COLUMN     "theory_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "view_at" TIMESTAMP(3),
ADD COLUMN     "wrong_questions" INTEGER DEFAULT 0;

-- DropTable
DROP TABLE "cycle_disciplines";

-- DropTable
DROP TABLE "cycle_stats";

-- DropTable
DROP TABLE "cycle_topics";

-- DropTable
DROP TABLE "discipline_stats";

-- DropTable
DROP TABLE "project_stats";

-- DropTable
DROP TABLE "question_attempts";

-- DropTable
DROP TABLE "study_sessions";

-- DropTable
DROP TABLE "topic_stats";

-- CreateIndex
CREATE UNIQUE INDEX "cycles_name_key" ON "cycles"("name");

-- CreateIndex
CREATE INDEX "disciplines_cycleId_idx" ON "disciplines"("cycleId");

-- CreateIndex
CREATE UNIQUE INDEX "disciplines_name_key" ON "disciplines"("name");

-- AddForeignKey
ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
