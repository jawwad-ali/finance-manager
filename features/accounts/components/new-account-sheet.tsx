import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { insertAccountsSchema } from "@/db/schema"
import AccountForm from "@/features/accounts/components/account-form"
import { useNewAccount } from "@/features/accounts/hooks/use-new-account"
import { z } from "zod"
import { useCreateAccount } from "../hooks/use-create-account"

const formSchema = insertAccountsSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccount()

    const mutation = useCreateAccount()

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
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
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new Acccount to track your transactions.
                    </SheetDescription>
                </SheetHeader>

                <AccountForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValues={{ name: "" }} />
            </SheetContent>
        </Sheet>
    )
}