/*
  Warnings:

  - You are about to drop the column `subscription` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "subscription",
ADD COLUMN     "e2eeIterations" INTEGER,
ADD COLUMN     "e2eeSalt" TEXT,
ADD COLUMN     "e2eeVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "e2eeWrappedDek" TEXT;
