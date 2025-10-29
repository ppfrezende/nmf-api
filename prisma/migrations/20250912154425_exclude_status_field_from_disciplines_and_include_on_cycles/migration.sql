/*
  Warnings:

  - You are about to drop the column `status` on the `disciplines` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cycles" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PLANNING';

-- AlterTable
ALTER TABLE "disciplines" DROP COLUMN "status";
