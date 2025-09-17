'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getCategories } from "@/lib/actions/categories"
import { createProduct, updateProduct } from "@/lib/actions/products"
import type { Category, Product } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle, Upload, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

const variantSchema = z.object({
  weight: z.string().min(1, 'Weight/Unit is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
});

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  categoryId: z.string().min(1, { message: "Please select a category." }),
  brand: z.string().optional(),
  unitType: z.enum(['weight', 'piece']).default('weight'),
  isOrganic: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isDeal: z.boolean().default(false),
  images: z.array(z.string()).min(1, { message: "Please add at least one image."}),
  variants: z.array(variantSchema).min(1, { message: 'At least one product variant is required.'}),
})

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!product;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(isEditing && Array.isArray(product.images) ? product.images : []);

  useEffect(() => {
    async function fetchCategories() {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
    }
    fetchCategories();
  }, [])

  const defaultValues = isEditing && product ? {
      ...product,
      images: Array.isArray(product.images) ? product.images : [],
      unitType: product.unitType || 'weight',
  } : {
      name: "",
      description: "",
      categoryId: "",
      brand: "",
      unitType: 'weight' as const,
      isOrganic: false,
      isFeatured: false,
      isDeal: false,
      images: [],
      variants: [{ weight: '1kg', price: 0, originalPrice: 0, stock: 0 }],
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: "variants",
  });
  
  const unitType = form.watch('unitType');

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
    if (files.length === 0) return;

    const currentImages = form.getValues('images') || [];

    const filePromises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as string);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(newImageUrls => {
        const updatedUrls = [...currentImages, ...newImageUrls];
        form.setValue('images', updatedUrls, { shouldValidate: true, shouldDirty: true });
        setImagePreviews(updatedUrls);
    }).catch(error => {
        toast({
            title: "Error uploading image",
            description: "There was an issue reading one of the image files.",
            variant: "destructive"
        })
    })

    e.target.value = '';
  };
  
  const removeImage = (indexToRemove: number) => {
    const currentImages = form.getValues('images') || [];
    const updatedImages = currentImages.filter((_, index) => index !== indexToRemove);
    form.setValue('images', updatedImages, { shouldValidate: true, shouldDirty: true });
    setImagePreviews(updatedImages);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description for the product details page."
                      rows={6}
                      {...field}
                    />
                </FormControl>
                <FormDescription>
                    Provide a detailed description for the product details page.
                </FormDescription>
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
                            Upload one or more images for your product. The first is the primary.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
              control={form.control}
              name="unitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select how this product is sold" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="weight">Weight (e.g., kg, g)</SelectItem>
                      <SelectItem value="piece">Piece (e.g., each, pack)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose if the product is sold by weight or by individual pieces/packs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardHeader>
                <CardTitle>Product Variants</CardTitle>
                <FormDescription>
                  Add different options for this product. The first variant will be the default.
                </FormDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {variantFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeVariant(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <FormField
                        control={form.control}
                        name={`variants.${index}.weight`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{unitType === 'weight' ? 'Weight' : 'Unit'}</FormLabel>
                            <FormControl>
                              <Input placeholder={unitType === 'weight' ? "e.g. 500g, 1kg" : "e.g., 1 piece, 6-pack"} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`variants.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sale Price</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="6.99" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name={`variants.${index}.originalPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Original Price</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="8.99" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.stock`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="100" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => appendVariant({ weight: '', price: 0, originalPrice: 0, stock: 0 })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
                 <FormMessage>{form.formState.errors.variants?.message}</FormMessage>
              </CardContent>
            </Card>
           
             <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Woodsman" {...field} />
                    </FormControl>
                    <FormDescription>
                        The brand of the product.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
          <FormField
                control={form.control}
                name="categoryId"
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
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
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
                    name="isFeatured"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Featured Product</FormLabel>
                            <FormDescription>
                            Show this product in the featured section on the homepage.
                            </FormDescription>
                        </div>
                    </FormItem>
                    )}
                />
         <FormField
                    control={form.control}
                    name="isDeal"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Deal of the Day</FormLabel>
                            <FormDescription>
                            Show this product in the deals section on the homepage.
                            </FormDescription>
                        </div>
                    </FormItem>
                    )}
                />
        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Product')}
        </Button>
      </form>
    </Form>
  )
}
