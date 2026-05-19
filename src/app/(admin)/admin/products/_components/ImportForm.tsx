
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'
import { importProducts } from '@/lib/actions/products'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { useRef } from 'react'

const excelTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]

const formSchema = z.object({
  file: z.any()
    .refine((files) => files?.length > 0, 'Excel file is required.')
    .refine(
      (files) => excelTypes.includes(files?.[0]?.type) || /\.xlsx?$/i.test(files?.[0]?.name ?? ''),
      'Only .xlsx or .xls files are accepted.'
    ),
})

type ImportFormValues = z.infer<typeof formSchema>

export function ImportForm() {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm<ImportFormValues>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: ImportFormValues) {
    const formData = new FormData()
    formData.append('file', values.file[0])

    try {
        const result = await importProducts(formData);
        toast({
            title: "Success",
            description: result.message,
        });
        form.reset();
        formRef.current?.reset();
    } catch(error: any) {
        toast({
            title: "Error",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
        })
    }
  }

  return (
    <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="file"
            render={() => (
                <FormItem>
                <FormLabel>Excel File</FormLabel>
                <FormControl>
                    <Input 
                        type="file" 
                        accept=".xlsx,.xls"
                        {...form.register("file")}
                    />
                </FormControl>
                <FormDescription>
                    Product spreadsheet (.xlsx). Column names are flexible (extra spaces are OK).
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting} className="rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                {form.formState.isSubmitting ? 'Importing...' : 'Start Import'}
            </Button>
        </form>
    </Form>
  )
}
