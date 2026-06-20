'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/Button';
import { SITE_NAME } from '@/constants';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await authService.login(data);
      if (res.data) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        const role = res.data.user?.role;
        router.push(role === 'ADMIN' ? '/admin' : '/dashboard');
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/baku-login.jpg"
          alt="Baku Maiden Tower"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-secondary/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link href="/">
            <Image src="/logo.png" alt={SITE_NAME} width={220} height={60} className="h-14 w-auto object-contain brightness-0 invert" />
          </Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Your journey through Azerbaijan starts here
            </h2>
            <p className="text-white/70 text-lg">
              Sign in to book tours, save favorites, and manage your travel plans.
            </p>
          </div>
          <p className="text-white/40 text-sm">© 2026 {SITE_NAME}</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Link href="/">
              <Image src="/logo.png" alt={SITE_NAME} width={180} height={50} className="h-12 w-auto object-contain" />
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-text mb-2">Welcome back</h1>
          <p className="text-text-secondary mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-error">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
