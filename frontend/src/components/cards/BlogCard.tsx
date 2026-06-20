'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, User } from 'lucide-react';
import { BlogPost } from '@/types';
import { formatDate, truncate, cn } from '@/lib/utils';

interface Props { post: BlogPost; className?: string }

export default function BlogCard({ post, className }: Props) {
  const readTime = Math.ceil((post.content?.length || 0) / 1000);

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className={cn('group', className)}>
      <Link href={`/blog/${post.slug}`}>
        <article className="bg-surface rounded-2xl overflow-hidden border border-border hover:shadow-hover transition-shadow duration-300 h-full flex flex-col">
          <div className="relative h-48 overflow-hidden shrink-0">
            <Image
              src={post.coverImage || '/placeholder.jpg'}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-bold text-text group-hover:text-primary transition-colors line-clamp-2 text-lg leading-snug">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-sm text-text-secondary mt-2 line-clamp-3 flex-1">
                {truncate(post.excerpt, 120)}
              </p>
            )}

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-xs text-text-muted">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{post.author?.name || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span>{formatDate(post.createdAt)}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
