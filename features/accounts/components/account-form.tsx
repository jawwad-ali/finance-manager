import { z } from "zod"
import { TrashIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { insertAccountsSchema } from "@/db/schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = insertAccountsSchema.pick({ name: true })

type FormValues = z.input<typeof formSchema>
type Props = {
    id?: string
    defaultValues?: FormValues
    onSubmit: (values: FormValues) => void
    onDelete?: () => void
    disabled?: boolean 
}

const AccountForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
    const form = useForm<FormValues>({ 
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const handleSubmit = (values: FormValues) => {
        onSubmit(values)
    }

    const handleDelete = () => {
        onDelete?.() 
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <>
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={disabled}
                                        placeholder="e.g Cash, Bank"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        </>
                    )}
                />

                <Button className="w-full" disabled={disabled}>
                    {id ? "Save Changes" : "Create New Account"}
                </Button>
                {
                    !!id &&
                    <Button
                        type="button"
                        disabled={disabled}
                        className="w-full"
                        onClick={handleDelete}
                        variant="outline"
                    >
                        <TrashIcon className="mr-2 size-4" />
                        Delete
                    </Button>
                }
            </form>
        </Form>
    )
}

export default AccountForm