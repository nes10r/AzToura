'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Globe, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { NAV_LINKS, SITE_NAME } from '@/constants';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="bg-secondary sticky top-0 z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Globe className="w-6 h-6 text-white" />
              <span className="font-bold text-white text-base tracking-tight">{SITE_NAME}</span>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      pathname.startsWith(link.href)
                        ? 'text-white bg-white/20 underline underline-offset-4'
                        : 'text-white/80 hover:text-white hover:bg-white/10',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/auth/register">
                <Button
                  size="sm"
                  className="bg-transparent border border-white/60 text-white hover:bg-white/10 hover:border-white rounded-full"
                >
                  Register
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="sm"
                  className="bg-white text-secondary hover:bg-white/90 rounded-full font-semibold"
                >
                  <User className="w-3.5 h-3.5" />
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden p-2 text-white/80 hover:text-white rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="fixed top-14 left-0 right-0 z-40 bg-secondary border-t border-white/10 lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname.startsWith(link.href)
                      ? 'text-white bg-white/20'
                      : 'text-white/80 hover:text-white hover:bg-white/10',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 grid grid-cols-2 gap-2 border-t border-white/10">
                <Link href="/auth/register">
                  <Button size="sm" className="w-full bg-transparent border border-white/50 text-white hover:bg-white/10 rounded-full">
                    Register
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="sm" className="w-full bg-white text-secondary font-semibold rounded-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
