'use client';

import { motion } from 'framer-motion';
import { Destination } from '@/types';
import DestinationCard from './DestinationCard';

const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DestinationGrid({ destinations }: { destinations: Destination[] }) {
  if (!destinations.length) return null;
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      {destinations.map((d) => (
        <motion.div key={d.id} variants={fadeUp}>
          <DestinationCard destination={d} />
        </motion.div>
      ))}
    </motion.div>
  );
}
