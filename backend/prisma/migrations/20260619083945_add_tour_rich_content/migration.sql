-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "faq" JSONB,
ADD COLUMN     "highlights" JSONB,
ADD COLUMN     "inclusions" JSONB,
ADD COLUMN     "itinerary" JSONB,
ADD COLUMN     "meetingPoint" TEXT,
ADD COLUMN     "packingList" JSONB;
