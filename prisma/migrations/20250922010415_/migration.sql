/*
  Warnings:

  - A unique constraint covering the columns `[cycleId,topicId,isDeleted]` on the table `study_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "uniq_active_session_per_cycle_topic" ON "study_sessions"("cycleId", "topicId", "isDeleted");
