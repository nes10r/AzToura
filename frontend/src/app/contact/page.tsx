'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type Form = z.infer<typeof schema>;

const contactInfo = [
  { icon: MapPin, label: 'Address', value: '28 May Street, Baku AZ1000, Azerbaijan' },
  { icon: Mail, label: 'Email', value: 'hello@aztour.az' },
  { icon: Phone, label: 'Phone', value: '+994 70 282 82 01' },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: Form) => {
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
  };

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-bold">Contact Us</h1>
          <p className="mt-3 text-white/70 text-lg max-w-xl mx-auto">
            Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll respond within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text">Get in Touch</h2>
            <p className="text-text-secondary leading-relaxed">
              Whether you have a question about a destination, need help with a booking, or want to partner with us —
              our team is here to help.
            </p>

            {contactInfo.map((info) => (
              <div key={info.label} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <info.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{info.label}</p>
                  <p className="text-text font-medium mt-0.5">{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
                <CheckCircle className="w-16 h-16 text-success" />
                <h3 className="text-2xl font-bold text-text">Message Sent!</h3>
                <p className="text-text-secondary max-w-sm">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <Button variant="outline" onClick={() => setSent(false)}>Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-border rounded-2xl p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Full Name</label>
                    <input
                      {...register('name')}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors"
                    />
                    {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Email Address</label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors"
                    />
                    {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Subject</label>
                  <input
                    {...register('subject')}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors"
                  />
                  {errors.subject && <p className="mt-1 text-xs text-error">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Message</label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    placeholder="Tell us more about your question or request…"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors resize-none"
                  />
                  {errors.message && <p className="mt-1 text-xs text-error">{errors.message.message}</p>}
                </div>

                <Button type="submit" size="lg" loading={isSubmitting}>
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
