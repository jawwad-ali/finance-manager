import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { categories, insertCategorySchema } from "@/db/schema"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import CategoryForm from "@/features/categories/components/category-form"
import { useOpenCategory } from "@/features/categories/hooks/use-open-category"
import { useGetCategory } from "@/features/categories/api/use-get-category"
import { useEditCategory } from "@/features/categories/api/use-edit-category"
import { useDeleteCategories } from "@/features/categories/api/use-delete-category"
import UseConfirm from "@/hooks/use-confirm"

const formSchema = insertCategorySchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory()
    const [ConfirmationDialog, confirm] = UseConfirm("Are you sure?", "You are about to delete")

    const categoryQuery = useGetCategory(id)
    const updateMutation = useEditCategory(id)
    const deleteMutation = useDeleteCategories(id)

    // Gook To Add new Category
    const onSubmit = (values: FormValues) => {
        updateMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    // Value in the input filed when edit button is clicked
    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data.name
    } : {
        name: ""
    }

    const isLoading = categoryQuery.isLoading
    const isPending = updateMutation.isPending || deleteMutation.isPending

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
                            Edit Category
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing category
                        </SheetDescription>
                    </SheetHeader>
                    {
                        isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="size-4 text-muted-foreground animate-spin" />
                            </div>
                        ) : (
                            <CategoryForm
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