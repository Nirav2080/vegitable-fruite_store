
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
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Image URLs</FormLabel>
                        <FormControl>
                            <Textarea placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                            Enter comma-separated URLs for product images.
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
                        <Select onValuechange={field.onChange} defaultValue={field.value}>
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
