/*
  Warnings:

  - You are about to drop the column `text` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Note" DROP COLUMN "text",
ADD COLUMN     "body" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "title" SET DEFAULT 'Untitled';
