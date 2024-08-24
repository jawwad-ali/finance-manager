import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { insertTransactionsSchema } from "@/db/schema"
import { z } from "zod"

import { Loader2 } from "lucide-react"
import { useEditTransaction } from "../api/use-edit-transaction"
import { useDeleteTransaction } from "../api/use-delete-transaction"
import UseConfirm from "@/hooks/use-confirm"
import { useOpenTransaction } from "../hooks/use-open-transaction"
import { useGetTransaction } from "../api/use-get-transaction"
import TransactionForm from "./transaction-form"

import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useCreateCategory } from "@/features/categories/api/use-create-category"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useCreateAccount } from "@/features/accounts/api/use-create-account"


const formSchema = insertTransactionsSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>

export const EditTransactionSheet = () => {
    const { isOpen, onClose, id } = useOpenTransaction()
    console.log("transId", id)
    const [ConfirmationDialog, confirm] = UseConfirm("Are you sure?", "You are about to delete")

    const transactionQuery = useGetTransaction(id)
    const updateMutation = useEditTransaction(id)
    const deleteMutation = useDeleteTransaction(id)

    // Categories
    const categoryQuery = useGetCategories()
    const categoryMutation = useCreateCategory()


    const categoriesOption = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id
    }))

    // Account
    const accountQuery = useGetAccounts()
    const accountMutation = useCreateAccount()

    const AccountOption = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }))

    // Gook To Add new transaction
    const onSubmit = (values: FormValues) => {
        updateMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    // Value in the input filed when edit button is clicked
    const defaultValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        payee: transactionQuery.data.payee,
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        notes: transactionQuery.data.notes,
    } : {
        accountId: "",
        categoryId: "",
        payee: "",
        notes: "",
        date: new Date(),
        amount: "",
    }

    const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading

    const isPending =
        updateMutation.isPending ||
        deleteMutation.isPending ||
        transactionQuery.isPending ||
        categoryMutation.isPending ||
        accountMutation.isPending;

    const onDelete = async () => {
        const ok = await confirm()
        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose()
                }
            })
        }
    }

    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Transaction
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing transaction
                        </SheetDescription>
                    </SheetHeader>
                    {
                        isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="size-4 text-muted-foreground animate-spin" />
                            </div>
                        ) : (
                            <TransactionForm
                                id={id}
                                onSubmit={onSubmit}
                                onDelete={onDelete}
                                defaultValues={defaultValues}
                                disabled={isPending}
                                categoryOptions={categoriesOption}
                                // onCreateCategory={onCreateCategory}
                                accountOptions={AccountOption}
                            // onCreateAccount={onCreateAccount}

                            />
                        )
                    }

                </SheetContent>
            </Sheet>
        </>

    )
}