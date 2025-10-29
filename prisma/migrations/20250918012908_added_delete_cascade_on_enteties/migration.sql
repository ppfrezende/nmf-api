-- DropForeignKey
ALTER TABLE "cycles" DROP CONSTRAINT "cycles_projectId_fkey";

-- DropForeignKey
ALTER TABLE "disciplines" DROP CONSTRAINT "disciplines_projectId_fkey";

-- DropForeignKey
ALTER TABLE "study_sessions" DROP CONSTRAINT "study_sessions_cycleId_fkey";

-- DropForeignKey
ALTER TABLE "study_sessions" DROP CONSTRAINT "study_sessions_projectId_fkey";

-- DropForeignKey
ALTER TABLE "study_sessions" DROP CONSTRAINT "study_sessions_topicId_fkey";

-- DropForeignKey
ALTER TABLE "topics" DROP CONSTRAINT "topics_disciplineId_fkey";

-- AddForeignKey
ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
