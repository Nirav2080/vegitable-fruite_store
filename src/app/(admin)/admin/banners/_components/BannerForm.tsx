
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
import type { Banner } from "@/lib/types"
import { createBanner, updateBanner } from "@/lib/actions/banners"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"

const formSchema = z.object({
  supertitle: z.string().min(1, "Supertitle is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  image: z.string().min(1, "An image is required"),
  href: z.string().min(1, "A link URL is required"),
  isActive: z.boolean().default(true),
})

type BannerFormValues = z.infer<typeof formSchema>

interface BannerFormProps {
  banner?: Banner
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!banner;

  const [imagePreview, setImagePreview] = useState<string | null>(isEditing && banner ? banner.image : null);

  const defaultValues = isEditing && banner ? banner : {
      supertitle: "",
      title: "",
      subtitle: "",
      image: "",
      href: "",
      isActive: true,
  }

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: BannerFormValues) {
    try {
      if (isEditing && banner) {
        await updateBanner(banner.id, values);
        toast({ title: "Success", description: "Banner updated successfully." });
      } else {
        await createBanner(values);
        toast({ title: "Success", description: "Banner created successfully." });
      }
      router.push("/admin/banners");
      router.refresh();
    } catch (error: any) {
       toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} banner.`,
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
                <Input placeholder="e.g. Naturally Fresh, Locally Sourced" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supertitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supertitle</FormLabel>
              <FormControl>
                <Input placeholder="e.g. FRESH & ORGANIC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Experience the taste of Aotearoa..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
            control={form.control}
            name="image"
            render={() => (
                <FormItem>
                    <FormLabel>Banner Image</FormLabel>
                    {imagePreview ? (
                         <div className="relative aspect-video w-full max-w-lg">
                            <Image
                            src={imagePreview}
                            alt="Banner preview"
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
                        The main image for the hero banner. Recommended size: 1200x600 pixels.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
        <FormField
          control={form.control}
          name="href"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link URL</FormLabel>
              <FormControl>
                <Input placeholder="/products" {...field} />
              </FormControl>
               <FormDescription>
                The page to link to when the banner is clicked (e.g. /products?category=Fruits).
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
                    Set whether this banner is currently visible on the website.
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
          {form.formState.isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Banner')}
        </Button>
      </form>
    </Form>
  )
}
