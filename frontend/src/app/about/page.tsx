import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Shield, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about aztoura and our mission to showcase the beauty of Azerbaijan.',
};

const values = [
  { icon: Globe, title: 'Authentic Experiences', description: 'We curate genuine Azerbaijani cultural experiences that go beyond the tourist trail.' },
  { icon: Shield, title: 'Trusted Platform', description: 'Every listing is verified and reviewed to ensure the highest quality for travellers.' },
  { icon: Heart, title: 'Local First', description: 'We work closely with local guides, hotels, and businesses to support Azerbaijani communities.' },
  { icon: Zap, title: 'Seamless Travel', description: 'From discovery to booking, we make planning your Azerbaijan trip effortless.' },
];

const team = [
  { name: 'Anar Mammadov', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'Leyla Aliyeva', role: 'Head of Partnerships', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { name: 'Kamran Huseynov', role: 'Lead Developer', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
];

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[380px]">
        <Image
          src="/images/baku-night.jpg"
          alt="Baku Maiden Tower at night"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-white/80 max-w-xl">
            We are on a mission to share the magic of Azerbaijan with the world.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Mission</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-text mt-2 mb-6">
          Connecting the world to Azerbaijan&apos;s wonders
        </h2>
        <p className="text-text-secondary text-lg leading-relaxed">
          aztoura is the premier digital destination for discovering, planning, and booking
          travel experiences across Azerbaijan. From the ancient city of Baku to the snow-capped peaks of
          Shahdag and the subtropical valleys of Lankaran, we showcase the extraordinary diversity of this
          remarkable country.
        </p>
      </section>

      {/* Values */}
      <section className="bg-surface border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-text mb-2">{v.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text">Meet the Team</h2>
          <p className="text-text-secondary mt-2">The people behind aztoura</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-primary/20">
                <Image src={member.img} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="font-bold text-text">{member.name}</h3>
              <p className="text-sm text-primary mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to explore Azerbaijan?</h2>
          <p className="text-white/80 mb-8 text-lg">
            Discover destinations, book tours, and create memories that last a lifetime.
          </p>
          <Link href="/destinations">
            <Button size="xl" variant="accent">Start Exploring</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
