
'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { Offer } from "@/lib/types"
import { createOffer, updateOffer } from "@/lib/actions/offers"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  code: z.string().optional(),
  discount: z.coerce.number().optional(),
  link: z.string().min(1, "A link URL is required"),
  bgColor: z.string().min(1, "Background color is required"),
  isActive: z.boolean().default(true),
})

type OfferFormValues = z.infer<typeof formSchema>

interface OfferFormProps {
  offer?: Offer
}

export function OfferForm({ offer }: OfferFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!offer;

  const defaultValues = isEditing && offer ? offer : {
      title: "",
      description: "",
      code: "",
      discount: 0,
      link: "/products",
      bgColor: "#F3F7E8",
      isActive: true,
  }

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: OfferFormValues) {
    try {
      if (isEditing && offer) {
        await updateOffer(offer.id, values);
        toast({ title: "Success", description: "Offer updated successfully." });
      } else {
        await createOffer(values);
        toast({ title: "Success", description: "Offer created successfully." });
      }
      router.push("/admin/offers");
      router.refresh();
    } catch (error: any) {
       toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} offer.`,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Best Online Deals, Free Stuff" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Only on this week... don't miss" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Discount (%)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="15" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Discount Code</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. CARE10" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link URL</FormLabel>
              <FormControl>
                <Input placeholder="/products" {...field} />
              </FormControl>
               <FormDescription>
                The page to link to when the offer is clicked (e.g. /products?category=Fruits).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="bgColor"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                    <div className="flex items-center gap-2">
                        <Input type="color" {...field} className="w-12 h-10 p-1" />
                        <Input type="text" {...field} placeholder="#F3F7E8" />
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                <FormLabel className="text-base">
                    Active
                </FormLabel>
                <FormDescription>
                    Set whether this offer is currently visible on the website.
                </FormDescription>
                </div>
                <FormControl>
                <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
                </FormControl>
            </FormItem>
            )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Offer')}
        </Button>
      </form>
    </Form>
  )
}
