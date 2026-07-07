
'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/lib/actions/auth';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await login({ email, password });

      if (result.success) {
        toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
        localStorage.setItem('isCustomerLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        window.dispatchEvent(new Event('loginStateChange'));
        const redirectTo = searchParams.get('redirectTo') || '/account';
        router.push(redirectTo);
        router.refresh();
      } else {
        toast({ title: 'Login failed', description: result.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Login failed', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-400px)] overflow-hidden py-12 sm:py-16">
      <Card className="relative mx-auto max-w-sm w-full rounded-2xl border-border/30 shadow-md shadow-black/[0.04]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold tracking-tight">Login</CardTitle>
          <CardDescription className="text-sm">
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
            </div>
            <Button type="submit" className="w-full rounded-xl shadow-sm" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[calc(100vh-400px)]">
        <div>Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
