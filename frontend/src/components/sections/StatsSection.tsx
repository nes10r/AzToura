'use client';

import { motion } from 'framer-motion';
import { MapPin, Building2, Utensils, CalendarDays } from 'lucide-react';

const stats = [
  { icon: MapPin, value: '50+', label: 'Destinations', color: 'text-primary bg-primary/10' },
  { icon: Building2, value: '200+', label: 'Hotels', color: 'text-secondary bg-secondary/10' },
  { icon: Utensils, value: '150+', label: 'Restaurants', color: 'text-accent bg-accent/10' },
  { icon: CalendarDays, value: '100+', label: 'Events per year', color: 'text-primary bg-primary/10' },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-3xl font-bold text-text">{stat.value}</p>
                <p className="text-sm text-text-secondary mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
