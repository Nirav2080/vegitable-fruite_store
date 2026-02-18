
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentUser, updateUserProfile } from "@/lib/actions/users";
import type { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const NZ_REGIONS = [
    'Northland', 'Auckland', 'Waikato', 'Bay of Plenty', 'Gisborne',
    'Hawke\'s Bay', 'Taranaki', 'Manawatu-Wanganui', 'Wellington',
    'Tasman', 'Nelson', 'Marlborough', 'West Coast', 'Canterbury',
    'Otago', 'Southland',
];

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
  firstName: z.string().min(2, "First name must have at least 2 characters."),
  lastName: z.string().min(2, "Last name must have at least 2 characters."),
  phone: z.string().optional(),
  street: z.string().optional(),
  suburb: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  postcode: z.string().regex(/^\d{4}$/, "NZ postcode must be 4 digits.").optional().or(z.literal('')),
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
            firstName: '',
            lastName: '',
            phone: '',
            street: '',
            suburb: '',
            city: '',
            region: '',
            postcode: '',
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
                            firstName: fullUser.firstName || fullUser.name?.split(' ')[0] || '',
                            lastName: fullUser.lastName || fullUser.name?.split(' ').slice(1).join(' ') || '',
                            phone: fullUser.phone || fullUser.mobile || '',
                            street: fullUser.shippingAddress?.street || '',
                            suburb: fullUser.shippingAddress?.suburb || '',
                            city: fullUser.shippingAddress?.city || '',
                            region: fullUser.shippingAddress?.region || '',
                            postcode: fullUser.shippingAddress?.postcode || '',
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
            const shippingAddress = data.street ? {
                street: data.street,
                suburb: data.suburb || '',
                city: data.city || '',
                region: data.region || '',
                postcode: data.postcode || '',
                country: 'New Zealand',
            } : undefined;
            const result = await updateUserProfile(user.id, {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                shippingAddress,
                billingAddress: shippingAddress,
            });
            if(result.success) {
                toast({
                    title: "Success",
                    description: "Your profile has been updated successfully.",
                });
                setUser(result.user);
                const displayName = `${data.firstName} ${data.lastName}`.trim();
                localStorage.setItem('currentUser', JSON.stringify({ id: result.user.id, name: displayName, email: result.user.email }));
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

    const displayName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.name;
    const userInitials = displayName.split(' ').map(n => n[0]).join('');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-extrabold tracking-tight font-headline">My Profile</h2>
                <p className="text-muted-foreground leading-relaxed">Update your personal information and email address.</p>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 ring-2 ring-primary/20 ring-offset-2">
                            <AvatarImage src={user.avatar} alt="User avatar" />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{userInitials}</AvatarFallback>
                        </Avatar>
                        <Button type="button" variant="outline" className="rounded-full border-border/60 transition-all duration-300 hover:shadow-sm">Change Photo</Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user.email} disabled />
                    </div>

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+64 21 123 4567" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Separator />
                    <h3 className="text-lg font-bold">Shipping Address</h3>

                    <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="123 Queen Street" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="suburb"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Suburb</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ponsonby" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City / Town</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Auckland" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Region</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-[200px]">
                                            {NZ_REGIONS.map(r => (
                                                <SelectItem key={r} value={r}>{r}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="postcode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postcode</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1010" maxLength={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-2">
                            <Label>Country</Label>
                            <Input value="New Zealand" disabled className="bg-muted/50" />
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" disabled={form.formState.isSubmitting} className="rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
