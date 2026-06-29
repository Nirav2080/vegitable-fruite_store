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
import { resetPassword } from '@/lib/actions/password-reset';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const linkValid = Boolean(token && email);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword({ email, token, password });
      if (result.success) {
        setDone(true);
        toast({ title: 'Success', description: result.message });
        setTimeout(() => router.push('/login'), 1800);
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-400px)] overflow-hidden py-12 sm:py-16">
      <Card className="relative mx-auto max-w-sm w-full rounded-2xl border-border/30 shadow-md shadow-black/[0.04]">
        {!linkValid ? (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl font-bold tracking-tight">Invalid link</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                This password reset link is missing required information. Please request a new one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full rounded-xl">
                <Link href="/forgot-password">Request a new link</Link>
              </Button>
            </CardContent>
          </>
        ) : done ? (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold tracking-tight">Password reset</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Your password has been updated. Redirecting you to login…
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full rounded-xl">
                <Link href="/login">Go to login</Link>
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold tracking-tight">Set a new password</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Choose a new password for <span className="font-medium text-foreground">{email}</span>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl shadow-sm" disabled={isLoading}>
                  {isLoading ? 'Resetting…' : 'Reset password'}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-400px)]">
          <div>Loading…</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
