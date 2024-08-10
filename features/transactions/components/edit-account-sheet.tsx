import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { accounts, insertAccountsSchema } from "@/db/schema"
import { z } from "zod"
import AccountForm from "@/features/accounts/components/account-form"

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"
import { useGetAccount } from "@/features/accounts/api/use-get-account"
import { Loader2 } from "lucide-react"
import { useEditAccount } from "../api/use-edit-account"
import { useDeleteAccount } from "../api/use-delete-account"
import UseConfirm from "@/hooks/use-confirm"

const formSchema = insertAccountsSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

export const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount()
    const [ConfirmationDialog, confirm] = UseConfirm("Are you sure?", "You are about to delete")

    const accountQuery = useGetAccount(id)
    const updateMutation = useEditAccount(id)
    const deleteMutation = useDeleteAccount(id)

    // Gook To Add new Account
    const onSubmit = (values: FormValues) => {
        updateMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    // Value in the input filed when edit button is clicked
    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : {
        name: ""
    }

    const isLoading = accountQuery.isLoading
    const isPending = updateMutation.isPending || deleteMutation.isPending

    const onDelete = async() => {
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
                            Edit Account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account
                        </SheetDescription>
                    </SheetHeader>
                    {
                        isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="size-4 text-muted-foreground animate-spin" />
                            </div>
                        ) : (
                            <AccountForm
                                id={id}
                                onSubmit={onSubmit}
                                onDelete={onDelete}
                                disabled={isPending}
                                defaultValues={defaultValues} />
                        )
                    }

                </SheetContent>
            </Sheet>
        </>

    )
}