/*
  Warnings:

  - You are about to drop the column `review` on the `dossiers` table. All the data in the column will be lost.
  - Added the required column `text` to the `dossiers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dossiers" DROP COLUMN "review",
ADD COLUMN     "hasSpoiler" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "text" TEXT NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;
