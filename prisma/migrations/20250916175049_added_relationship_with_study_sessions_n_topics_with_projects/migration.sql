-- AlterTable
ALTER TABLE "study_sessions" ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "topics" ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
