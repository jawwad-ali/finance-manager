"use client"
import { Loader2, Plus } from "lucide-react"
import { columns } from "./columns" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useNewCategory } from "@/features/categories/hooks/use-new-category"
import { useDeleteBulkCategories } from "@/features/categories/api/use-bulk-delete-categories"

const CategoriesPage = () => { 
    // Handle New category.
    const newCategory = useNewCategory()

    //Reteriving all categories
    const categoriesQuery = useGetCategories()
    const categories = categoriesQuery.data || []
 
    // Deleting Bulk categories
    const deleteCategories = useDeleteBulkCategories()

    // Disable del button while categories are deleting
    const isDisabled =
        categoriesQuery.isLoading || deleteCategories.isPending

    // Loading Component
    if (categoriesQuery.isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <div className="h-[500px] flex items-center justify-center">
                        <Loader2 className="size-8 text-slate-300 animate-spin" />
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Categories Page
                    </CardTitle>
                    <Button size="sm" onClick={newCategory.onOpen}>
                        <Plus className="size-4 mr-2" />
                        Add New
                    </Button>
                </CardHeader>

                {/* Dislpaying the Table */}
                <CardContent>
                    <div className="container mx-auto py-10">
                        <DataTable
                            columns={columns} 
                            data={categories}
                            filterKey="Name"
                            onDelete={(row) => {
                                const ids = row.map((r) => r.original.id)
                                deleteCategories.mutate({ ids })
                            }}
                            disabled={isDisabled}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CategoriesPage