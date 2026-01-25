
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
import type { Attribute } from "@/lib/types"
import { createAttribute, updateAttribute } from "@/lib/actions/attributes"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { X, PlusCircle } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  values: z.array(z.object({ value: z.string().min(1, "Value cannot be empty") })).min(1, "At least one value is required"),
})

type AttributeFormValues = z.infer<typeof formSchema>

interface AttributeFormProps {
  attribute?: Attribute
}

export function AttributeForm({ attribute }: AttributeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!attribute;

  const defaultValues = isEditing && attribute 
    ? { name: attribute.name, values: attribute.values.map(v => ({ value: v })) } 
    : { name: "", values: [{ value: "" }] };

  const form = useForm<AttributeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "values"
  });

  async function onSubmit(values: AttributeFormValues) {
    try {
      const dataToSubmit = {
        name: values.name,
        values: values.values.map(v => v.value)
      };

      if (isEditing && attribute) {
        await updateAttribute(attribute.id, dataToSubmit);
        toast({ title: "Success", description: "Attribute updated successfully." });
      } else {
        await createAttribute(dataToSubmit);
        toast({ title: "Success", description: "Attribute created successfully." });
      }
      router.push("/admin/attributes");
      router.refresh();
    } catch (error: any) {
       toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} attribute.`,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attribute Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Size" {...field} />
              </FormControl>
              <FormDescription>
                The name of the filter group that will appear on the shop page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
            <FormLabel>Attribute Values</FormLabel>
            <FormDescription className="mb-4">The different options for this attribute.</FormDescription>
            <div className="space-y-4">
            {fields.map((field, index) => (
                <FormField
                key={field.id}
                control={form.control}
                name={`values.${index}.value`}
                render={({ field }) => (
                    <FormItem>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Input placeholder={`Value ${index + 1}`} {...field} />
                        </FormControl>
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
            ))}
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ value: "" })}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Value
            </Button>
        </div>
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Attribute')}
        </Button>
      </form>
    </Form>
  )
}
