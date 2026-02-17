
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { login, register } from '@/lib/actions/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CheckoutAuth() {
    const { toast } = useToast();
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const result = await login({ email: loginEmail, password: loginPassword });
            if (result.success && result.user) {
                toast({ title: 'Success', description: 'Logged in successfully.' });
                localStorage.setItem('isCustomerLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                window.dispatchEvent(new Event('loginStateChange'));
            }
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Invalid email or password.', variant: 'destructive' });
        }
        setIsLoading(false);
    };

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const result = await register({ name: registerName, email: registerEmail, password: registerPassword });
            if (result.success) {
                toast({ title: 'Success', description: 'Account created. Please log in.' });
            }
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Could not create account.', variant: 'destructive' });
        }
        setIsLoading(false);
    }

    return (
        <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
             <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-xl">
                    <TabsTrigger value="login" className="rounded-lg">Login</TabsTrigger>
                    <TabsTrigger value="register" className="rounded-lg">Create Account</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                     <form onSubmit={handleLogin} className="grid gap-4 mt-4">
                        <div className="grid gap-2">
                            <Label htmlFor="login-email">Email</Label>
                            <Input id="login-email" type="email" placeholder="you@example.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="login-password">Password</Label>
                            <Input id="login-password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full rounded-full shadow-md shadow-primary/25 transition-all duration-300 hover:scale-[1.02]" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </TabsContent>
                <TabsContent value="register">
                     <form onSubmit={handleRegister} className="grid gap-4 mt-4">
                         <div className="grid gap-2">
                            <Label htmlFor="register-name">Full Name</Label>
                            <Input id="register-name" type="text" placeholder="John Doe" required value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="register-email">Email</Label>
                            <Input id="register-email" type="email" placeholder="you@example.com" required value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="register-password">Password</Label>
                            <Input id="register-password" type="password" required value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full rounded-full shadow-md shadow-primary/25 transition-all duration-300 hover:scale-[1.02]" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Account'}
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
}
