
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
import type { Category } from "@/lib/types"
import { createCategory, updateCategory } from "@/lib/actions/categories"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCategories } from "@/lib/cached-data";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  icon: z.string().optional(),
  parentId: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
  category?: Category
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!category;

  const [iconPreview, setIconPreview] = useState<string | null | undefined>( isEditing && category ? category.icon : null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const defaultValues = isEditing && category ? { ...category, parentId: category.parentId || "" } : { name: "", icon: "", parentId: "" };

   useEffect(() => {
    async function fetchCategories() {
        const fetchedCategories = await getCategories();
        // Filter out the current category from the list of possible parents
        setCategories(fetchedCategories.filter(c => c.id !== category?.id));
    }
    fetchCategories();
  }, [category?.id])

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: CategoryFormValues) {
    try {
      const dataToSubmit: any = { ...values };
      if (dataToSubmit.icon === '') {
        delete dataToSubmit.icon;
      }
      if (dataToSubmit.parentId === '' || dataToSubmit.parentId === 'none') {
        delete dataToSubmit.parentId;
      }
      
      if (isEditing && category) {
        await updateCategory(category.id, dataToSubmit);
        toast({ title: "Success", description: "Category updated successfully." });
      } else {
        await createCategory(dataToSubmit);
        toast({ title: "Success", description: "Category created successfully." });
      }
      router.push("/admin/categories");
      router.refresh();
    } catch (error: any) {
       console.error("Failed to save category:", error);
       toast({
        title: "Error",
        description: String(error.message || error) || `Failed to ${isEditing ? 'update' : 'create'} category.`,
        variant: "destructive",
      });
    }
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const result = event.target?.result as string;
        setIconPreview(result);
        form.setValue('icon', result, { shouldValidate: true, shouldDirty: true });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  
  const removeIcon = () => {
    form.setValue('icon', '', { shouldValidate: true, shouldDirty: true });
    setIconPreview(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Fresh Vegetables" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || 'none'}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a parent category (optional)" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <FormDescription>
                    Leave empty to create a top-level category.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="icon"
            render={() => (
                <FormItem>
                    <FormLabel>Category Image</FormLabel>
                     <div className="flex gap-4 items-start">
                        {iconPreview && (
                            <div className="relative w-24 h-24 p-2 border border-border/30 rounded-xl flex items-center justify-center">
                                <Image src={iconPreview} alt="Category image preview" fill className="object-contain" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6"
                                    onClick={removeIcon}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <div className="flex-1">
                             <FormControl>
                                <div className="w-full p-4 border-2 border-dashed rounded-2xl text-center cursor-pointer hover:bg-muted">
                                    <label htmlFor="icon-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Click or drag to upload an image</span>
                                    </label>
                                    <Input 
                                        id="icon-upload" 
                                        type="file" 
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleIconChange}
                                    />
                                </div>
                            </FormControl>
                        </div>
                    </div>
                    <FormDescription>
                        Upload an image for the category. This is optional.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
        
        <Button type="submit" disabled={form.formState.isSubmitting} className="rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
          {form.formState.isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Category')}
        </Button>
      </form>
    </Form>
  )
}
