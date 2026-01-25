
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
import { useState } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  code: z.string().optional(),
  discount: z.coerce.number().optional(),
  link: z.string().min(1, "A link URL is required"),
  image: z.string().min(1, "An image is required"),
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

  const [imagePreview, setImagePreview] = useState<string | null>(isEditing && offer ? offer.image : null);

  const defaultValues = isEditing && offer ? offer : {
      title: "",
      description: "",
      code: "",
      discount: 0,
      link: "/products",
      image: "",
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
       console.error("Failed to save offer:", error);
       toast({
        title: "Error",
        description: String(error.message || error) || `Failed to ${isEditing ? 'update' : 'create'} offer.`,
        variant: "destructive",
      });
    }
  }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setImagePreview(result);
            form.setValue('image', result, { shouldValidate: true, shouldDirty: true });
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const removeImage = () => {
        form.setValue('image', '', { shouldValidate: true, shouldDirty: true });
        setImagePreview(null);
    };

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
            name="image"
            render={() => (
                <FormItem>
                    <FormLabel>Offer Image</FormLabel>
                    {imagePreview ? (
                         <div className="relative aspect-video w-full max-w-lg">
                            <Image
                            src={imagePreview}
                            alt="Offer preview"
                            fill
                            className="rounded-md object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7"
                                onClick={removeImage}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <FormControl>
                            <div className="w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-muted">
                                <label htmlFor="image-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Click or drag to upload an image</span>
                                </label>
                                <Input 
                                    id="image-upload" 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </FormControl>
                    )}
                    <FormDescription>
                        The background image for the offer card. Recommended size: 600x300 pixels.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
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
