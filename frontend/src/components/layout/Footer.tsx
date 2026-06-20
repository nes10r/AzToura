import Link from 'next/link';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import { SITE_NAME, NAV_LINKS } from '@/constants';

const footerLinks = {
  Discover: NAV_LINKS,
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-text text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">{SITE_NAME}</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              Discover the beauty of Azerbaijan. From the ancient streets of Baku to the peaks of the Caucasus, your adventure begins here.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Baku, Azerbaijan</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>hello@azerbaijantourism.az</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+994 12 000 0000</span>
              </div>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{group}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Built with love for Azerbaijan 🇦🇿
          </p>
        </div>
      </div>
    </footer>
  );
}
