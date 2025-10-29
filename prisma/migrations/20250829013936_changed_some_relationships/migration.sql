/*
  Warnings:

  - You are about to drop the column `name` on the `cycles` table. All the data in the column will be lost.
  - You are about to drop the column `pages_readed` on the `cycles` table. All the data in the column will be lost.
  - You are about to drop the column `question_platform_link` on the `cycles` table. All the data in the column will be lost.
  - You are about to drop the column `question_status` on the `cycles` table. All the data in the column will be lost.
  - You are about to drop the column `right_questions` on the `cycles` table. All the data in the column will be lost.
  - You are about to drop the column `scanning_reading_duration_sec` on the `cycles` table. All the data in the column will be lost.
  - You are about to drop the column `skimming_reading_duration_sec` on the `cycles` table. All the data in the column will be lost.
  - You are about to drop the column `study_method` on the `cycles` table. All the data in the column will be lost.
  - You are about to drop the column `theory_status` on the `cycles` table. All the data in the column will be lost.
  - You are about to drop the column `topicId` on the `cycles` table. All the data in the column will be lost.
  - You are about to drop the column `view_at` on the `cycles` table. All the data in the column will be lost.
  - You are about to drop the column `wrong_questions` on the `cycles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,title]` on the table `cycles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `cycles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cycles" DROP CONSTRAINT "cycles_topicId_fkey";

-- DropIndex
DROP INDEX "cycles_name_key";

-- DropIndex
DROP INDEX "cycles_topicId_idx";

-- AlterTable
ALTER TABLE "cycles" DROP COLUMN "name",
DROP COLUMN "pages_readed",
DROP COLUMN "question_platform_link",
DROP COLUMN "question_status",
DROP COLUMN "right_questions",
DROP COLUMN "scanning_reading_duration_sec",
DROP COLUMN "skimming_reading_duration_sec",
DROP COLUMN "study_method",
DROP COLUMN "theory_status",
DROP COLUMN "topicId",
DROP COLUMN "view_at",
DROP COLUMN "wrong_questions",
ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "study_sessions" (
    "id" TEXT NOT NULL,
    "scanning_reading_duration_sec" INTEGER DEFAULT 0,
    "skimming_reading_duration_sec" INTEGER DEFAULT 0,
    "pages_readed" INTEGER DEFAULT 0,
    "theory_status" BOOLEAN NOT NULL DEFAULT false,
    "right_questions" INTEGER DEFAULT 0,
    "wrong_questions" INTEGER DEFAULT 0,
    "questions_duration_sec" INTEGER DEFAULT 0,
    "question_status" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "view_at" TIMESTAMP(3),
    "study_method" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "topicId" TEXT,
    "cyclesId" TEXT,

    CONSTRAINT "study_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "study_sessions_topicId_idx" ON "study_sessions"("topicId");

-- CreateIndex
CREATE INDEX "cycles_projectId_idx" ON "cycles"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "cycles_projectId_title_key" ON "cycles"("projectId", "title");

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_cyclesId_fkey" FOREIGN KEY ("cyclesId") REFERENCES "cycles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
