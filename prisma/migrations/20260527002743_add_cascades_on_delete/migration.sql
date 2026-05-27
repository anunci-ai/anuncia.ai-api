-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "generated_images" DROP CONSTRAINT "generated_images_listing_id_fkey";

-- DropForeignKey
ALTER TABLE "listings" DROP CONSTRAINT "listings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_fkey";

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_images" ADD CONSTRAINT "generated_images_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
