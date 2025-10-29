
-- AlterTable
ALTER TABLE "cycles" ADD COLUMN     "deleted_at" TIMESTAMP(3) NULL,
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "disciplines" ADD COLUMN     "deleted_at" TIMESTAMP(3) NULL,
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "topics" ADD COLUMN     "deleted_at" TIMESTAMP(3) NULL,
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
