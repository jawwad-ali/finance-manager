import { z } from "zod"
import { TrashIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { insertTransactionsSchema } from "@/db/schema"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select } from "@/components/select"
import DatePicker from "@/components/date-picker"
import AmountInput from "@/components/amount-input"
import { convertAmountFromMiliunits, convertAmountToMiliUnits } from "@/lib/utils"

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional(),
})

const apiSchema = insertTransactionsSchema.omit({ id: true })

type FormValues = z.input<typeof formSchema>
type ApiFormValues = z.input<typeof apiSchema>

type Props = {
    id?: string
    defaultValues?: FormValues
    disabled?: boolean
    accountOptions?: { label: string, value: string }[]
    categoryOptions?: { label: string, value: string }[]
    onSubmit: (values: ApiFormValues) => void
    onDelete?: () => void
    onCreateAccount?: (name: string) => void
    onCreateCategory?: (name: string) => void
}

const TransactionForm = ({ id, defaultValues, onSubmit, onDelete, disabled, accountOptions, categoryOptions, onCreateAccount, onCreateCategory }: Props) => {

    console.log("defaultValues", defaultValues)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const handleSubmit = (values: FormValues) => {
        console.log(values)
        const amount = parseFloat(values.amount)
        const amountInMiliAmounts = convertAmountToMiliUnits(amount)
        onSubmit({
            ...values,
            amount: amountInMiliAmounts
        })
    }

    const handleDelete = () => {
        onDelete?.()
    }

    return (
        <Form {...form}>
            {id}
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField
                    name="date"
                    control={form.control}
                    render={({ field }) => (
                        <>
                            <FormItem>
                                <FormLabel>
                                    Date Picker
                                </FormLabel>
                                <FormControl>
                                    <DatePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled}
                                    />
                                </FormControl>
                            </FormItem>
                        </>
                    )}
                />

                <FormField
                    name="accountId"
                    control={form.control}
                    render={({ field }) => (
                        <>
                            <FormItem>
                                <FormLabel>
                                    Account Name
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder="Select an account"
                                        options={accountOptions}
                                        onCreate={onCreateAccount}
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled}
                                    />
                                </FormControl>
                            </FormItem>
                        </>
                    )}
                />

                {/* Category dropdown option */}
                <FormField
                    name="categoryId"
                    control={form.control}
                    render={({ field }) => (
                        <>
                            <FormItem>
                                <FormLabel>
                                    Category
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder="Select a category"
                                        options={categoryOptions}
                                        onCreate={onCreateCategory}
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled}
                                    />
                                </FormControl>
                            </FormItem>
                        </>
                    )}
                />

                <FormField
                    name="payee"
                    control={form.control}
                    render={({ field }) => (
                        <>
                            <FormItem>
                                <FormLabel>
                                    Payee
                                </FormLabel>
                                <FormControl>
                                    <Input disabled={disabled} placeholder="Add a payee" {...field} />
                                </FormControl>
                            </FormItem>
                        </>
                    )}
                />

                <FormField
                    name="amount"
                    control={form.control}
                    render={({ field }) => (
                        <>
                            <FormItem>
                                <FormLabel>
                                    Amount
                                </FormLabel>
                                <FormControl>
                                    <AmountInput
                                        {...field}
                                        disabled={disabled}
                                        placeholder="0.00"
                                    />

                                </FormControl>
                            </FormItem>
                        </>
                    )}
                />

                <FormField
                    name="notes"
                    control={form.control}
                    render={({ field }) => (
                        <>
                            <FormItem>
                                <FormLabel>
                                    Notes
                                </FormLabel>
                                <FormControl>
                                    <Textarea {...field}
                                        value={field.value ?? ""}
                                        disabled={disabled}
                                        placeholder="Add notes"
                                    />
                                </FormControl>
                            </FormItem>
                        </>
                    )}
                />

                <Button className="w-full" disabled={disabled}>
                    {id ? "Save Changes" : "Create New Transaction"}
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

export default TransactionForm