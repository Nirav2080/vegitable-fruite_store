
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

const formSchema = z.object({
  supertitle: z.string().min(1, "Supertitle is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  image: z.string().url("A valid image URL is required"),
  href: z.string().url("A valid link URL is required"),
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
    } catch (error) {
       toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} banner.`,
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://picsum.photos/1200/600" {...field} />
              </FormControl>
              <FormDescription>
                Provide a full URL for the banner image.
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
