'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/Button';
import { SITE_NAME } from '@/constants';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ confirmPassword: _, ...data }: FormData) => {
    setError('');
    try {
      const res = await authService.register(data);
      if (res.data) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-background pt-24">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-10">
          <Image src="/logo.png" alt={SITE_NAME} width={180} height={50} className="h-12 w-auto object-contain" />
        </Link>

        <h1 className="text-3xl font-bold text-text mb-2">Create account</h1>
        <p className="text-text-secondary mb-8">Join thousands of travelers exploring Azerbaijan</p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Full Name</label>
            <input
              {...register('name')}
              placeholder="John Smith"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors"
            />
            {errors.name && <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors"
            />
            {errors.email && <p className="mt-1.5 text-xs text-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Phone (optional)</label>
            <input
              {...register('phone')}
              type="tel"
              placeholder="+994 50 000 0000"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-error">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Confirm Password</label>
            <input
              {...register('confirmPassword')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors"
            />
            {errors.confirmPassword && <p className="mt-1.5 text-xs text-error">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full mt-2" loading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
