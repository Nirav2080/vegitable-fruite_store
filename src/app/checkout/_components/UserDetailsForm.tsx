
'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile } from "@/lib/actions/users";
import type { User } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Pencil } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters."),
  email: z.string().email(),
  mobile: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserDetailsFormProps {
    user: User;
}

export function UserDetailsForm({ user }: UserDetailsFormProps) {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(!user.address);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user.name || '',
            email: user.email || '',
            mobile: user.mobile || '',
            address: user.address || '',
        }
    });

    async function onSubmit(data: ProfileFormValues) {
        try {
            const result = await updateUserProfile(user.id, data);
            if(result.success) {
                toast({
                    title: "Success",
                    description: "Your details have been updated.",
                });
                setIsEditing(false);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update your details. Please try again.",
                variant: "destructive",
            });
        }
    }
    
    return (
        <div className="rounded-lg border bg-background p-6">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-semibold">Shipping Information</h2>
                 {!isEditing && (
                     <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                         <Pencil className="mr-2 h-4 w-4" /> Edit
                     </Button>
                 )}
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Textarea rows={3} {...field} disabled={!isEditing} placeholder="123 Organic Lane, Auckland" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={!isEditing} placeholder="e.g. 021 123 4567" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isEditing && (
                         <div className="flex gap-2 justify-end">
                            {user.address && <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>}
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Saving...' : 'Save Details'}
                            </Button>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    );
}

