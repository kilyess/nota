/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Note" DROP COLUMN "isPublic";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "apiKey" TEXT NOT NULL DEFAULT '';
