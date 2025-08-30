
'use client'

import { useForm, useFieldArray } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Product } from "@/lib/types"
import { createProduct, updateProduct } from "@/lib/actions/products"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  longDescription: z.string().min(20, { message: "Long description must be at least 20 characters." }),
  price: z.coerce.number().min(0.01, { message: "Price must be a positive number." }),
  category: z.enum(['Fruits', 'Vegetables', 'Organic Boxes']),
  stock: z.coerce.number().int().min(0, { message: "Stock cannot be negative." }),
  isOrganic: z.boolean().default(false),
  isSeasonal: z.boolean().default(false),
  images: z.string().min(1, { message: "Please add at least one image URL."}),
})

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!product;
  
  const [imagePreviews, setImagePreviews] = useState<string[]>(isEditing && Array.isArray(product.images) ? product.images : []);

  const defaultValues = isEditing && product ? {
      ...product,
      images: Array.isArray(product.images) ? product.images.join(', ') : product.images,
  } : {
      name: "",
      description: "",
      longDescription: "",
      price: 0,
      category: "Vegetables" as const,
      stock: 0,
      isOrganic: false,
      isSeasonal: false,
      images: "",
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: ProductFormValues) {
    try {
      if (isEditing && product) {
        await updateProduct(product.id, values);
        toast({ title: "Success", description: "Product updated successfully." });
      } else {
        await createProduct(values);
        toast({ title: "Success", description: "Product created successfully." });
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
       toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} product.`,
        variant: "destructive",
      });
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    // For prototyping, we'll use placeholder URLs since we don't have file storage.
    // In a real app, you would upload files to a service and get back URLs.
    const newImageUrls = files.map((_, i) => `https://picsum.photos/seed/${Math.random()}/400`);

    const existingUrls = form.getValues('images') ? form.getValues('images').split(', ') : [];
    const updatedUrls = [...existingUrls, ...newImageUrls].filter(Boolean);

    form.setValue('images', updatedUrls.join(', '), { shouldValidate: true, shouldDirty: true });
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (indexToRemove: number) => {
    const currentUrls = form.getValues('images').split(', ').filter(Boolean);
    const updatedUrls = currentUrls.filter((_, index) => index !== indexToRemove);
    form.setValue('images', updatedUrls.join(', '), { shouldValidate: true, shouldDirty: true });

    const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    setImagePreviews(updatedPreviews);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-8 lg:col-span-2">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Organic Royal Gala Apples" {...field} />
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
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Crisp, sweet, and perfect for snacking." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Long Description</FormLabel>
                    <FormControl>
                        <Textarea rows={5} placeholder="Describe the product in more detail..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="images"
                    render={() => (
                        <FormItem>
                            <FormLabel>Product Images</FormLabel>
                            <FormControl>
                                <div className="w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-muted">
                                    <label htmlFor="image-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Click or drag to upload images</span>
                                    </label>
                                    <Input 
                                        id="image-upload" 
                                        type="file" 
                                        multiple 
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </FormControl>
                             {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-4">
                                    {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <Image
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        fill
                                        className="rounded-md object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6"
                                            onClick={() => removeImage(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    ))}
                                </div>
                            )}
                            <FormDescription>
                                Upload one or more images for your product.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <div className="space-y-8">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="6.99" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="150" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Fruits">Fruits</SelectItem>
                                <SelectItem value="Vegetables">Vegetables</SelectItem>
                                <SelectItem value="Organic Boxes">Organic Boxes</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="isOrganic"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Organic</FormLabel>
                                <FormDescription>
                                    Is this product certified organic?
                                </FormDescription>
                            </div>
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isSeasonal"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Seasonal</FormLabel>
                                <FormDescription>
                                Is this product a seasonal item?
                                </FormDescription>
                            </div>
                        </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Product')}
        </Button>
      </form>
    </Form>
  )
}
