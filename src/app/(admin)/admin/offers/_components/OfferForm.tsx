
'use client'

import { useForm, Controller } from "react-hook-form"
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
import type { Offer, Product } from "@/lib/types"
import { createOffer, updateOffer } from "@/lib/actions/offers"
import { getProducts } from "@/lib/cached-data"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const offerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  code: z.string().optional().transform(v => v === '' ? undefined : v),
  discountValue: z.coerce.number().min(0, "Discount must be a positive value"),
  discountType: z.enum(['percentage', 'fixed']),
  scope: z.enum(['cart', 'product']),
  applicableProductIds: z.array(z.string()).optional(),
  link: z.string().min(1, "A link URL is required"),
  image: z.string().min(1, "An image is required"),
  isActive: z.boolean().default(true),
}).refine(data => {
    if (data.scope === 'product' && (!data.applicableProductIds || data.applicableProductIds.length === 0)) {
        return false;
    }
    return true;
}, {
    message: "You must select at least one product for a product-specific discount.",
    path: ["applicableProductIds"],
});

type OfferFormValues = z.infer<typeof offerSchema>

interface OfferFormProps {
  offer?: Offer
}

export function OfferForm({ offer }: OfferFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!offer;

  const [imagePreview, setImagePreview] = useState<string | null>(isEditing && offer ? offer.image : null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
        const prods = await getProducts();
        setProducts(prods);
    }
    fetchProducts();
  }, []);

  const defaultValues = isEditing && offer ? {
      ...offer,
      applicableProductIds: offer.applicableProductIds || [],
  } : {
      title: "",
      description: "",
      code: "",
      discountValue: 0,
      discountType: 'percentage' as 'percentage' | 'fixed',
      scope: 'cart' as 'cart' | 'product',
      applicableProductIds: [],
      link: "/products",
      image: "",
      isActive: true,
  }

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues,
  })

  async function onSubmit(values: OfferFormValues) {
    try {
      const dataToSubmit = { ...values };
      if (dataToSubmit.scope !== 'product') {
          delete dataToSubmit.applicableProductIds;
      }
      
      if (isEditing && offer) {
        await updateOffer(offer.id, dataToSubmit);
        toast({ title: "Success", description: "Offer updated successfully." });
      } else {
        await createOffer(dataToSubmit);
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

    const scope = form.watch('scope');

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
        
        <Card className="rounded-2xl border-border/60">
            <CardHeader><CardTitle>Discount Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Discount Code</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. SALE10" {...field} />
                        </FormControl>
                        <FormDescription>Customers will enter this code at checkout. Leave blank for automatic offers.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="discountType"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>Discount Type</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                                >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="percentage" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Percentage</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="fixed" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Fixed Amount</FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="discountValue"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Discount Value</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder={form.getValues('discountType') === 'percentage' ? '15' : '10'} {...field} />
                            </FormControl>
                            <FormDescription>{form.getValues('discountType') === 'percentage' ? 'As a percentage (e.g., 15 for 15%)' : 'As a fixed amount (e.g., 10 for $10)'}</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="scope"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Apply Discount To</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="cart" />
                                </FormControl>
                                <FormLabel className="font-normal">Entire Cart</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="product" />
                                </FormControl>
                                <FormLabel className="font-normal">Specific Products</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                
                {scope === 'product' && (
                    <Controller
                        control={form.control}
                        name="applicableProductIds"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Applicable Products</FormLabel>
                                <ScrollArea className="h-48 w-full rounded-xl border border-border/60 p-4">
                                     {products.map((product) => (
                                        <div key={product.id} className="flex items-center space-x-2 mb-2">
                                            <Checkbox
                                                id={product.id}
                                                checked={field.value?.includes(product.id)}
                                                onCheckedChange={(checked) => {
                                                    const currentValues = field.value || [];
                                                    return checked
                                                    ? field.onChange([...currentValues, product.id])
                                                    : field.onChange(currentValues.filter((id) => id !== product.id))
                                                }}
                                            />
                                            <label htmlFor={product.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {product.name}
                                            </label>
                                        </div>
                                    ))}
                                </ScrollArea>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </CardContent>
        </Card>

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
                            className="rounded-xl object-cover"
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
                            <div className="w-full p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer hover:bg-muted">
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
            <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/60 p-4">
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
        <Button type="submit" disabled={form.formState.isSubmitting} className="rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
          {form.formState.isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Offer')}
        </Button>
      </form>
    </Form>
  )
}
