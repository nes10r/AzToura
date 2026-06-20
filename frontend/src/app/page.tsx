import HeroSection from '@/components/sections/HeroSection';
import CategorySection from '@/components/sections/CategorySection';
import FeaturedDestinations from '@/components/sections/FeaturedDestinations';

export const revalidate = 120; // ISR: 2 dəqiqədə bir yenilə

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedDestinations />
    </>
  );
}
