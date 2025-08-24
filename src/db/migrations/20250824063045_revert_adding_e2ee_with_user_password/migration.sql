/*
  Warnings:

  - You are about to drop the column `e2eeIterations` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `e2eeSalt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `e2eeVersion` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `e2eeWrappedDek` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "e2eeIterations",
DROP COLUMN "e2eeSalt",
DROP COLUMN "e2eeVersion",
DROP COLUMN "e2eeWrappedDek",
ADD COLUMN     "subscription" TEXT NOT NULL DEFAULT 'free';
