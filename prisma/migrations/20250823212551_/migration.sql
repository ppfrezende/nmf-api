/*
  Warnings:

  - The `status` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'DONE');

-- AlterTable
ALTER TABLE "disciplines" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "pages_readed" INTEGER DEFAULT 0,
ADD COLUMN     "reading_duration_sec" INTEGER DEFAULT 0,
ADD COLUMN     "right_questions" INTEGER DEFAULT 0,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PLANNING',
ADD COLUMN     "wrong_questions" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PLANNING';

-- DropEnum
DROP TYPE "ProjectStatus";
