
'use client'

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentUser, updateUserProfile } from "@/lib/actions/users";
import type { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
            <Separator />
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
        </div>
    )
}

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters."),
  mobile: z.string().optional(),
  address: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function AccountProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: '',
            mobile: '',
            address: '',
        }
    });

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            const userDataString = localStorage.getItem('currentUser');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                try {
                    const fullUser = await getCurrentUser(userData.id);
                    setUser(fullUser);
                    if (fullUser) {
                        form.reset({
                            name: fullUser.name,
                            mobile: fullUser.mobile || '',
                            address: fullUser.address || '',
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    toast({ title: "Error", description: "Could not load user data.", variant: "destructive" });
                }
            }
            setIsLoading(false);
        };
        fetchUser();
    }, [form, toast]);
    
    async function onSubmit(data: ProfileFormValues) {
        if (!user) return;
        try {
            const result = await updateUserProfile(user.id, data);
            if(result.success) {
                toast({
                    title: "Success",
                    description: "Your profile has been updated successfully.",
                });
                setUser(result.user);
                localStorage.setItem('currentUser', JSON.stringify({ id: result.user.id, name: result.user.name, email: result.user.email }));
                router.refresh();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update your profile. Please try again.",
                variant: "destructive",
            });
        }
    }


    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (!user) {
        return <div>Please log in to view your profile.</div>
    }

    const userInitials = user.name.split(' ').map(n => n[0]).join('');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold font-headline">My Profile</h2>
                <p className="text-muted-foreground">Update your personal information and email address.</p>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar} alt="User avatar" />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        <Button type="button" variant="outline">Change Photo</Button>
                    </div>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user.email} disabled />
                    </div>

                    <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Add a mobile number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                     <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shipping Address</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Add a default shipping address" rows={3} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-2">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
