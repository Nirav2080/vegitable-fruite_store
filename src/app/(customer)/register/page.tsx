
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
import { useRouter } from 'next/navigation';
import { register } from '@/lib/actions/auth';
import Link from 'next/link';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await register({ name, email, password });
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Account created successfully. Please log in.',
        });
        router.push('/login');
      }
    } catch (error: any) {
       toast({
        title: 'Error',
        description: error.message || 'Failed to create account.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-400px)] overflow-hidden py-12 sm:py-16">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>
      <Card className="relative mx-auto max-w-sm w-full rounded-2xl border-border/60 shadow-xl shadow-primary/5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold tracking-tight">Create an Account</CardTitle>
          <CardDescription>
            Enter your details below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
               <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <Button type="submit" className="w-full rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
