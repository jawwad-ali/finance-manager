import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import TransactionForm from "@/features/transactions/components/transaction-form"
import { z } from "zod"
import { insertTransactionsSchema } from "@/db/schema"
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"
import { useCreateTransaction } from "../api/use-create-transaction"
import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useCreateCategory } from "@/features/categories/api/use-create-category"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { Loader2 } from "lucide-react"
import { useCreateAccount } from "@/features/accounts/api/use-create-account"

const formSchema = insertTransactionsSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>

export const NewTransactionSheet = () => {
    const { isOpen, onClose } = useNewTransaction()

    const createMutation = useCreateTransaction()

    // Categories
    const categoryQuery = useGetCategories()
    const categoryMutation = useCreateCategory()

    const onCreateCategory = (name: string) => categoryMutation.mutate({
        name
    })
    const categoriesOption = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id
    }))

    // Account
    const accountQuery = useGetAccounts()
    const accountMutation = useCreateAccount()

    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    })
    const AccountOption = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }))

    // Pending State
    const isPending =
        createMutation.isPending ||
        categoryMutation.isPending ||
        accountMutation.isPending

    // Loading State
    const isLoading =
        categoryQuery.isLoading ||
        accountQuery.isLoading

    // When the form is Submit
    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Create a new Transaction.
                    </SheetDescription>
                </SheetHeader>

                {
                    isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <TransactionForm 
                            onSubmit={onSubmit}
                            disabled={isPending}
                            categoryOptions={categoriesOption}
                            onCreateCategory={onCreateCategory}
                            accountOptions={AccountOption}
                            onCreateAccount={onCreateAccount}
                        />
                    )
                }

            </SheetContent>
        </Sheet>
    )
}