"use client"
import { useNewAccount } from "@/features/accounts/hooks/use-new-account"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { Skeleton } from "@/components/ui/skeleton"
import { useDeleteBulkAccounts } from "@/features/accounts/api/use-bulk-delete-accounts"

const AccountsPage = () => {
    // Handle New Acc.   
    const newAccount = useNewAccount()

    //Reteriving all accounts 
    const accountsQuery = useGetAccounts()
    const accounts = accountsQuery.data || []

    // Deleting Bulk Accounts
    const deleteAccounts = useDeleteBulkAccounts()

    // Disable del button while accounts are deleting
    const isDisabled =
        accountsQuery.isLoading || deleteAccounts.isPending

    // Loading Component
    if (accountsQuery.isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <div className="h-[500px] flex items-center justify-center">
                        <Loader2 className="size-8 text-slate-300 animate-spin" />
                        Please wait...
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
                        Accounts Page
                    </CardTitle>
                    <Button size="sm" onClick={newAccount.onOpen}>
                        <Plus className="size-4 mr-2" />
                        Add New
                    </Button>
                </CardHeader>

                {/* Dislpaying the Table */}
                <CardContent>
                    <div className="container mx-auto py-10">
                        <DataTable
                            columns={columns}
                            data={accounts}
                            filterKey="Name"
                            onDelete={(row) => {
                                const ids = row.map((r) => r.original.id)
                                deleteAccounts.mutate({ ids })
                            }}
                            disabled={isDisabled}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AccountsPage