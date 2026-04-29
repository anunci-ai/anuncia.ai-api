/*
  Warnings:

  - The values [PROCESSING,PENDING] on the enum `StatusEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `short_description` on the `listings` table. All the data in the column will be lost.
  - You are about to drop the column `subject_image_url` on the `listings` table. All the data in the column will be lost.
  - Added the required column `input_description` to the `listings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusEnum_new" AS ENUM ('DRAFT', 'TEXT_PROCESSING', 'TEXT_COMPLETED', 'IMAGE_PROCESSING', 'IMAGE_COMPLETED', 'COMPLETED', 'FAILED');
ALTER TABLE "listings" ALTER COLUMN "status" TYPE "StatusEnum_new" USING ("status"::text::"StatusEnum_new");
ALTER TYPE "StatusEnum" RENAME TO "StatusEnum_old";
ALTER TYPE "StatusEnum_new" RENAME TO "StatusEnum";
DROP TYPE "public"."StatusEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "listings" DROP COLUMN "short_description",
DROP COLUMN "subject_image_url",
ADD COLUMN     "input_description" TEXT NOT NULL,
ADD COLUMN     "original_image_url" TEXT,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';
