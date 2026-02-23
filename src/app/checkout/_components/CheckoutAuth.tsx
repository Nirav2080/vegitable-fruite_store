
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { login, register } from '@/lib/actions/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, Mail, Lock, Phone, User } from 'lucide-react';

export function CheckoutAuth() {
    const { toast } = useToast();
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regFirstName, setRegFirstName] = useState('');
    const [regLastName, setRegLastName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const result = await login({ email: loginEmail, password: loginPassword });
            if (result.success && result.user) {
                toast({ title: 'Welcome back!', description: 'Logged in successfully.' });
                localStorage.setItem('isCustomerLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                window.dispatchEvent(new Event('loginStateChange'));
            }
        } catch (error: any) {
            toast({ title: 'Login Failed', description: error.message || 'Invalid email or password.', variant: 'destructive' });
        }
        setIsLoading(false);
    };

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const result = await register({
                firstName: regFirstName,
                lastName: regLastName,
                email: regEmail,
                password: regPassword,
                phone: regPhone || undefined,
            });
            if (result.success && result.user) {
                toast({ title: 'Account created!', description: 'You are now logged in.' });
                localStorage.setItem('isCustomerLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                window.dispatchEvent(new Event('loginStateChange'));
            }
        } catch (error: any) {
            toast({ title: 'Registration Failed', description: error.message || 'Could not create account.', variant: 'destructive' });
        }
        setIsLoading(false);
    }

    return (
        <div className="rounded-2xl border border-border/30 bg-background p-6 shadow-sm">
            <h2 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">1</div>
                Customer Information
            </h2>
             <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-xl h-11">
                    <TabsTrigger value="login" className="rounded-lg gap-1.5 text-sm">
                        <LogIn className="h-3.5 w-3.5" /> Login
                    </TabsTrigger>
                    <TabsTrigger value="register" className="rounded-lg gap-1.5 text-sm">
                        <UserPlus className="h-3.5 w-3.5" /> Create Account
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                    <p className="text-sm text-muted-foreground mt-3 mb-4">Already have an account? Sign in to auto-fill your details.</p>
                    <form onSubmit={handleLogin} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="login-email" type="email" placeholder="you@example.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="pl-10" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="login-password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="pl-10" />
                            </div>
                        </div>
                        <Button type="submit" className="w-full rounded-xl shadow-sm" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login & Continue'}
                        </Button>
                    </form>
                </TabsContent>

                <TabsContent value="register">
                    <p className="text-sm text-muted-foreground mt-3 mb-4">New customer? Create an account to get started.</p>
                    <form onSubmit={handleRegister} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="reg-first-name" className="text-sm font-medium">First Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="reg-first-name" type="text" placeholder="John" required value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} className="pl-10" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reg-last-name" className="text-sm font-medium">Last Name</Label>
                                <Input id="reg-last-name" type="text" placeholder="Doe" required value={regLastName} onChange={(e) => setRegLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reg-email" className="text-sm font-medium">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="reg-email" type="email" placeholder="you@example.com" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="pl-10" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reg-phone" className="text-sm font-medium">Phone Number <span className="text-muted-foreground font-normal">(optional)</span></Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="reg-phone" type="tel" placeholder="+64 21 123 4567" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="pl-10" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reg-password" className="text-sm font-medium">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="reg-password" type="password" placeholder="Min 8 characters" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="pl-10" />
                            </div>
                        </div>
                        <Button type="submit" className="w-full rounded-xl shadow-sm" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account & Continue'}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">By creating an account you agree to our Terms &amp; Conditions.</p>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
}
