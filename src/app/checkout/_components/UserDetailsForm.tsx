
'use client'

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { updateUserProfile } from "@/lib/actions/users";
import type { User } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Pencil, MapPin, User as UserIcon, Check } from 'lucide-react';

const NZ_REGIONS = [
    'Northland', 'Auckland', 'Waikato', 'Bay of Plenty', 'Gisborne',
    'Hawke\'s Bay', 'Taranaki', 'Manawatu-Wanganui', 'Wellington',
    'Tasman', 'Nelson', 'Marlborough', 'West Coast', 'Canterbury',
    'Otago', 'Southland',
];

const shippingFormSchema = z.object({
    firstName: z.string().min(2, "First name must have at least 2 characters."),
    lastName: z.string().min(2, "Last name must have at least 2 characters."),
    phone: z.string().optional(),
    street: z.string().min(3, "Street address is required."),
    suburb: z.string().optional(),
    city: z.string().min(2, "City is required."),
    region: z.string().min(2, "Region is required."),
    postcode: z.string().regex(/^\d{4}$/, "NZ postcode must be 4 digits."),
    billingStreet: z.string().optional(),
    billingSuburb: z.string().optional(),
    billingCity: z.string().optional(),
    billingRegion: z.string().optional(),
    billingPostcode: z.string().optional(),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;

interface UserDetailsFormProps {
    user: User;
    onFormValidityChange: (isValid: boolean) => void;
    onUserUpdate?: (user: User) => void;
}

export function UserDetailsForm({ user, onFormValidityChange, onUserUpdate }: UserDetailsFormProps) {
    const { toast } = useToast();
    const hasShippingAddress = !!user.shippingAddress?.street;
    const [isEditing, setIsEditing] = useState(!hasShippingAddress);
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

    const form = useForm<ShippingFormValues>({
        resolver: zodResolver(shippingFormSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: user.firstName || user.name?.split(' ')[0] || '',
            lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
            phone: user.phone || user.mobile || '',
            street: user.shippingAddress?.street || '',
            suburb: user.shippingAddress?.suburb || '',
            city: user.shippingAddress?.city || '',
            region: user.shippingAddress?.region || '',
            postcode: user.shippingAddress?.postcode || '',
            billingStreet: user.billingAddress?.street || '',
            billingSuburb: user.billingAddress?.suburb || '',
            billingCity: user.billingAddress?.city || '',
            billingRegion: user.billingAddress?.region || '',
            billingPostcode: user.billingAddress?.postcode || '',
        }
    });

    const { formState: { isValid } } = form;

    useEffect(() => {
        // Consider form valid if it passes validation AND street exists
        const streetValue = form.getValues('street');
        onFormValidityChange(isValid && !!streetValue);
    }, [isValid, onFormValidityChange, form]);

    async function onSubmit(data: ShippingFormValues) {
        try {
            const shippingAddress = {
                street: data.street,
                suburb: data.suburb || '',
                city: data.city,
                region: data.region,
                postcode: data.postcode,
                country: 'New Zealand',
            };

            const billingAddress = billingSameAsShipping
                ? shippingAddress
                : {
                    street: data.billingStreet || data.street,
                    suburb: data.billingSuburb || '',
                    city: data.billingCity || data.city,
                    region: data.billingRegion || data.region,
                    postcode: data.billingPostcode || data.postcode,
                    country: 'New Zealand',
                };

            const result = await updateUserProfile(user.id, {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                shippingAddress,
                billingAddress,
            });

            if (result.success) {
                toast({ title: "Details saved!", description: "Your shipping information has been updated." });
                setIsEditing(false);
                onFormValidityChange(true);
                if (onUserUpdate && result.user) {
                    onUserUpdate(result.user);
                }
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update your details. Please try again.", variant: "destructive" });
        }
    }
    
    return (
        <div className="space-y-6">
            {/* Customer Info */}
            <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">
                            {hasShippingAddress && !isEditing ? <Check className="h-4 w-4" /> : '1'}
                        </div>
                        Customer Information
                    </h2>
                    {!isEditing && (
                        <Button variant="ghost" size="sm" className="rounded-full text-xs" onClick={() => setIsEditing(true)}>
                            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                        </Button>
                    )}
                </div>

                {!isEditing && hasShippingAddress ? (
                    <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                        <div className="flex items-start gap-3">
                            <UserIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium text-sm">{user.firstName || user.name?.split(' ')[0]} {user.lastName || user.name?.split(' ').slice(1).join(' ')}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                {(user.phone || user.mobile) && <p className="text-sm text-muted-foreground">{user.phone || user.mobile}</p>}
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm">{user.shippingAddress?.street}</p>
                                {user.shippingAddress?.suburb && <p className="text-sm text-muted-foreground">{user.shippingAddress.suburb}</p>}
                                <p className="text-sm text-muted-foreground">
                                    {user.shippingAddress?.city}, {user.shippingAddress?.region} {user.shippingAddress?.postcode}
                                </p>
                                <p className="text-sm text-muted-foreground">{user.shippingAddress?.country || 'New Zealand'}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            {/* Name Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField control={form.control} name="firstName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">First Name *</FormLabel>
                                        <FormControl><Input {...field} placeholder="John" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="lastName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Last Name *</FormLabel>
                                        <FormControl><Input {...field} placeholder="Doe" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            {/* Email (read-only) */}
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input value={user.email} disabled className="bg-muted/50" />
                            </div>

                            {/* Phone */}
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Phone Number</FormLabel>
                                    <FormControl><Input {...field} placeholder="+64 21 123 4567" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Shipping Address Section */}
                            <div className="pt-2">
                                <h3 className="text-lg font-bold tracking-tight mb-3 flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</div>
                                    Shipping Address
                                </h3>

                                <div className="space-y-3">
                                    <FormField control={form.control} name="street" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Street Address *</FormLabel>
                                            <FormControl><Input {...field} placeholder="123 Queen Street" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="suburb" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Suburb</FormLabel>
                                            <FormControl><Input {...field} placeholder="Ponsonby" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <FormField control={form.control} name="city" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm">City / Town *</FormLabel>
                                                <FormControl><Input {...field} placeholder="Auckland" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="region" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm">Region *</FormLabel>
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
                                        )} />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <FormField control={form.control} name="postcode" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm">Postcode *</FormLabel>
                                                <FormControl><Input {...field} placeholder="1010" maxLength={4} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Country</label>
                                            <Input value="New Zealand" disabled className="bg-muted/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Billing Address Toggle */}
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="billing-same"
                                    checked={billingSameAsShipping}
                                    onCheckedChange={(checked) => setBillingSameAsShipping(checked === true)}
                                />
                                <label htmlFor="billing-same" className="text-sm font-medium leading-none cursor-pointer">
                                    Billing address is the same as shipping
                                </label>
                            </div>

                            {/* Billing Address (if different) */}
                            {!billingSameAsShipping && (
                                <div className="space-y-3 pt-2 border-t border-border/40">
                                    <h4 className="text-sm font-bold pt-2">Billing Address</h4>
                                    <FormField control={form.control} name="billingStreet" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Street Address</FormLabel>
                                            <FormControl><Input {...field} placeholder="123 Queen Street" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="billingSuburb" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Suburb</FormLabel>
                                            <FormControl><Input {...field} placeholder="Ponsonby" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <FormField control={form.control} name="billingCity" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm">City / Town</FormLabel>
                                                <FormControl><Input {...field} placeholder="Auckland" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="billingRegion" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm">Region</FormLabel>
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
                                        )} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <FormField control={form.control} name="billingPostcode" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm">Postcode</FormLabel>
                                                <FormControl><Input {...field} placeholder="1010" maxLength={4} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Country</label>
                                            <Input value="New Zealand" disabled className="bg-muted/50" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit */}
                            <div className="flex gap-2 justify-end pt-2">
                                {hasShippingAddress && (
                                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                )}
                                <Button type="submit" disabled={form.formState.isSubmitting} className="rounded-full px-6 shadow-md shadow-primary/25 transition-all duration-300 hover:scale-[1.02]">
                                    {form.formState.isSubmitting ? 'Saving...' : 'Save & Continue'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </div>
        </div>
    );
}
