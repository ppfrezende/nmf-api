-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'DONE');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "unactive_at" DROP NOT NULL;

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "board" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "disciplineId" TEXT,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cycles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cycle_disciplines" (
    "id" TEXT NOT NULL,
    "nameSnapshot" TEXT NOT NULL,
    "positionSnapshot" INTEGER NOT NULL DEFAULT 0,
    "totalTimeSec" INTEGER NOT NULL DEFAULT 0,
    "progressPct" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cycleId" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,

    CONSTRAINT "cycle_disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cycle_topics" (
    "id" TEXT NOT NULL,
    "titleSnapshot" TEXT NOT NULL,
    "positionSnapshot" INTEGER NOT NULL DEFAULT 0,
    "progressPct" INTEGER NOT NULL DEFAULT 0,
    "totalTimeSec" INTEGER NOT NULL DEFAULT 0,
    "qAttempts" INTEGER NOT NULL DEFAULT 0,
    "qCorrect" INTEGER NOT NULL DEFAULT 0,
    "qWrong" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cycleId" TEXT NOT NULL,
    "cycleDisciplineId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "cycle_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_sessions" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "durationSec" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "cycleId" TEXT,
    "cycleTopicId" TEXT,

    CONSTRAINT "study_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_attempts" (
    "id" TEXT NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correct" BOOLEAN NOT NULL,
    "timeSec" INTEGER,
    "source" TEXT,
    "itemRef" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "cycleTopicId" TEXT NOT NULL,

    CONSTRAINT "question_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cycle_stats" (
    "userId" TEXT NOT NULL,
    "totalTimeSec" INTEGER NOT NULL DEFAULT 0,
    "qAttempts" INTEGER NOT NULL DEFAULT 0,
    "qCorrect" INTEGER NOT NULL DEFAULT 0,
    "qWrong" INTEGER NOT NULL DEFAULT 0,
    "last_event_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cycleId" TEXT NOT NULL,

    CONSTRAINT "cycle_stats_pkey" PRIMARY KEY ("cycleId")
);

-- CreateTable
CREATE TABLE "project_stats" (
    "userId" TEXT NOT NULL,
    "totalTimeSec" INTEGER NOT NULL DEFAULT 0,
    "qAttempts" INTEGER NOT NULL DEFAULT 0,
    "qCorrect" INTEGER NOT NULL DEFAULT 0,
    "qWrong" INTEGER NOT NULL DEFAULT 0,
    "last_event_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_stats_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "discipline_stats" (
    "userId" TEXT NOT NULL,
    "totalTimeSec" INTEGER NOT NULL DEFAULT 0,
    "qAttempts" INTEGER NOT NULL DEFAULT 0,
    "qCorrect" INTEGER NOT NULL DEFAULT 0,
    "qWrong" INTEGER NOT NULL DEFAULT 0,
    "last_event_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disciplineId" TEXT NOT NULL,

    CONSTRAINT "discipline_stats_pkey" PRIMARY KEY ("disciplineId")
);

-- CreateTable
CREATE TABLE "topic_stats" (
    "userId" TEXT NOT NULL,
    "totalTimeSec" INTEGER NOT NULL DEFAULT 0,
    "qAttempts" INTEGER NOT NULL DEFAULT 0,
    "qCorrect" INTEGER NOT NULL DEFAULT 0,
    "qWrong" INTEGER NOT NULL DEFAULT 0,
    "last_event_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "topic_stats_pkey" PRIMARY KEY ("topicId")
);

-- CreateIndex
CREATE INDEX "projects_userId_idx" ON "projects"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_userId_title_key" ON "projects"("userId", "title");

-- CreateIndex
CREATE INDEX "disciplines_projectId_idx" ON "disciplines"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "disciplines_projectId_name_key" ON "disciplines"("projectId", "name");

-- CreateIndex
CREATE INDEX "topics_disciplineId_idx" ON "topics"("disciplineId");

-- CreateIndex
CREATE UNIQUE INDEX "topics_disciplineId_title_key" ON "topics"("disciplineId", "title");

-- CreateIndex
CREATE INDEX "cycles_projectId_idx" ON "cycles"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "cycles_projectId_name_key" ON "cycles"("projectId", "name");

-- CreateIndex
CREATE INDEX "cycle_disciplines_cycleId_idx" ON "cycle_disciplines"("cycleId");

-- CreateIndex
CREATE INDEX "cycle_disciplines_disciplineId_idx" ON "cycle_disciplines"("disciplineId");

-- CreateIndex
CREATE UNIQUE INDEX "cycle_disciplines_cycleId_disciplineId_key" ON "cycle_disciplines"("cycleId", "disciplineId");

-- CreateIndex
CREATE INDEX "cycle_topics_cycleId_idx" ON "cycle_topics"("cycleId");

-- CreateIndex
CREATE INDEX "cycle_topics_topicId_idx" ON "cycle_topics"("topicId");

-- CreateIndex
CREATE INDEX "cycle_topics_cycleDisciplineId_idx" ON "cycle_topics"("cycleDisciplineId");

-- CreateIndex
CREATE UNIQUE INDEX "cycle_topics_cycleId_topicId_key" ON "cycle_topics"("cycleId", "topicId");

-- CreateIndex
CREATE INDEX "study_sessions_userId_cycleId_startedAt_idx" ON "study_sessions"("userId", "cycleId", "startedAt");

-- CreateIndex
CREATE INDEX "study_sessions_cycleTopicId_idx" ON "study_sessions"("cycleTopicId");

-- CreateIndex
CREATE INDEX "question_attempts_userId_cycleId_answeredAt_idx" ON "question_attempts"("userId", "cycleId", "answeredAt");

-- CreateIndex
CREATE INDEX "question_attempts_userId_correct_idx" ON "question_attempts"("userId", "correct");

-- CreateIndex
CREATE INDEX "question_attempts_cycleTopicId_idx" ON "question_attempts"("cycleTopicId");

-- CreateIndex
CREATE INDEX "cycle_stats_userId_last_event_at_idx" ON "cycle_stats"("userId", "last_event_at");

-- CreateIndex
CREATE INDEX "project_stats_userId_last_event_at_idx" ON "project_stats"("userId", "last_event_at");

-- CreateIndex
CREATE INDEX "discipline_stats_userId_last_event_at_idx" ON "discipline_stats"("userId", "last_event_at");

-- CreateIndex
CREATE INDEX "topic_stats_userId_last_event_at_idx" ON "topic_stats"("userId", "last_event_at");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "disciplines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycle_disciplines" ADD CONSTRAINT "cycle_disciplines_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycle_disciplines" ADD CONSTRAINT "cycle_disciplines_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "disciplines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycle_topics" ADD CONSTRAINT "cycle_topics_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycle_topics" ADD CONSTRAINT "cycle_topics_cycleDisciplineId_fkey" FOREIGN KEY ("cycleDisciplineId") REFERENCES "cycle_disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycle_topics" ADD CONSTRAINT "cycle_topics_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_cycleTopicId_fkey" FOREIGN KEY ("cycleTopicId") REFERENCES "cycle_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_cycleTopicId_fkey" FOREIGN KEY ("cycleTopicId") REFERENCES "cycle_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycle_stats" ADD CONSTRAINT "cycle_stats_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_stats" ADD CONSTRAINT "project_stats_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discipline_stats" ADD CONSTRAINT "discipline_stats_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_stats" ADD CONSTRAINT "topic_stats_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
