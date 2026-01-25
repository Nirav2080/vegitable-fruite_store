
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
import type { Brand } from "@/lib/types"
import { createBrand, updateBrand } from "@/lib/actions/brands"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"

const formSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logo: z.string().min(1, "A logo is required"),
})

type BrandFormValues = z.infer<typeof formSchema>

interface BrandFormProps {
  brand?: Brand
}

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!brand;

  const [logoPreview, setLogoPreview] = useState<string | null>(isEditing && brand ? brand.logo : null);

  const defaultValues = isEditing && brand ? brand : { name: "", logo: "" };

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: BrandFormValues) {
    try {
      if (isEditing && brand) {
        await updateBrand(brand.id, values);
        toast({ title: "Success", description: "Brand updated successfully." });
      } else {
        await createBrand(values);
        toast({ title: "Success", description: "Brand created successfully." });
      }
      router.push("/admin/brands");
      router.refresh();
    } catch (error: any) {
       console.error("Failed to save brand:", error);
       toast({
        title: "Error",
        description: String(error.message || error) || `Failed to ${isEditing ? 'update' : 'create'} brand.`,
        variant: "destructive",
      });
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
        form.setValue('logo', result, { shouldValidate: true, shouldDirty: true });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeLogo = () => {
    form.setValue('logo', '', { shouldValidate: true, shouldDirty: true });
    setLogoPreview(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Aashirvaad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="logo"
            render={() => (
                <FormItem>
                    <FormLabel>Brand Logo</FormLabel>
                     <div className="flex gap-4 items-start">
                        {logoPreview && (
                            <div className="relative w-24 h-24 p-2 border rounded-md flex items-center justify-center bg-muted">
                                <Image src={logoPreview} alt="Brand logo preview" fill className="object-contain" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6"
                                    onClick={removeLogo}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <div className="flex-1">
                             <FormControl>
                                <div className="w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-muted">
                                    <label htmlFor="logo-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Click or drag to upload a logo</span>
                                    </label>
                                    <Input 
                                        id="logo-upload" 
                                        type="file" 
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleLogoChange}
                                    />
                                </div>
                            </FormControl>
                        </div>
                    </div>
                    <FormDescription>
                        Upload a logo for the brand.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Brand')}
        </Button>
      </form>
    </Form>
  )
}
