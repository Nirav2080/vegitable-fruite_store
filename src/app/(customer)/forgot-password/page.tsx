'use client';

import { useState } from 'react';
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
import { requestPasswordReset } from '@/lib/actions/password-reset';
import Link from 'next/link';
import { MailCheck, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const result = await requestPasswordReset({ email });
      if (result.success) {
        setSubmitted(true);
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
        {submitted ? (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MailCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold tracking-tight">Check your email</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                If an account exists for <span className="font-medium text-foreground">{email}</span>, we&apos;ve sent a link to reset your password. The link expires in 1 hour.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
                </Link>
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold tracking-tight">Forgot password?</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Enter your email and we&apos;ll send you a link to reset your password.
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
                <Button type="submit" className="w-full rounded-xl shadow-sm" disabled={isLoading}>
                  {isLoading ? 'Sending…' : 'Send reset link'}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                <Link href="/login" className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                  Back to login
                </Link>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
