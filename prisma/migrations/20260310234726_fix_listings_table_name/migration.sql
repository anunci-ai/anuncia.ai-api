/*
  Warnings:

  - You are about to drop the `Listing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_user_id_fkey";

-- DropForeignKey
ALTER TABLE "generated_images" DROP CONSTRAINT "generated_images_listing_id_fkey";

-- DropTable
DROP TABLE "Listing";

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "marketplace" "MarketplaceEnum" NOT NULL,
    "status" "StatusEnum" NOT NULL,
    "subject_image_url" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "generated_title" TEXT,
    "generated_description" TEXT,
    "generated_meta_title" TEXT,
    "generated_meta_description" TEXT,
    "generated_tags" TEXT[],
    "generated_slug" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_images" ADD CONSTRAINT "generated_images_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
