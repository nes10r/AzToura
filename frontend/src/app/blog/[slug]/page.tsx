'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import { BlogPost } from '@/types';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blog/${slug}`)
      .then(({ data }) => { if (data.data) setPost(data.data); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="pt-16 min-h-screen">
      <Skeleton className="h-[45vh] w-full rounded-none" />
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );

  if (!post) return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Article not found</h1>
      <Link href="/blog"><Button>Back to Blog</Button></Link>
    </div>
  );

  const readTime = Math.ceil((post.content?.length || 0) / 1000);

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        {post.coverImage && (
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-6">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover object-center" priority sizes="(max-width: 768px) 100vw, 768px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight mb-4">{post.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{post.author?.name || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{readTime} min read</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          {post.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return <h3 key={i} className="text-lg font-bold text-text mt-6 mb-2">{paragraph.replace(/\*\*/g, '')}</h3>;
            }
            if (paragraph.startsWith('- ')) {
              return (
                <ul key={i} className="list-disc pl-5 space-y-1 my-3">
                  {paragraph.split('\n').map((item, j) => (
                    <li key={j} className="text-text-secondary">{item.replace(/^- /, '')}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i} className="text-text-secondary leading-relaxed mb-4">{paragraph}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
