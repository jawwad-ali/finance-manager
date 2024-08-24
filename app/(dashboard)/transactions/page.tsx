"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions"
import { useDeleteBulkTransactions } from "@/features/transactions/api/use-bulk-delete-transactions"
import { useState } from "react"
import UploadButton from "./upload-button"
import ImportCard from "./import-card"

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
}

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {}
}

const TransactionsPage = () => {
    const [variants, setVariants] = useState<VARIANTS>(VARIANTS.LIST)
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)

    // CSV Upload
    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        console.log(results)
        setImportResults(results)
        setVariants(VARIANTS.IMPORT)
    }

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS)
        setVariants(VARIANTS.LIST)
    }

    // Handle New Transaction. 
    const newTransaction = useNewTransaction()

    //Reteriving all transactions
    const transactionsQuery = useGetTransactions()
    const transactions = transactionsQuery.data || []

    // Deleting Bulk Transactions
    const deleteTransactions = useDeleteBulkTransactions()

    // Disable del button while accounts are deleting
    const isDisabled =
        transactionsQuery.isLoading || deleteTransactions.isPending

    // Loading Component
    if (transactionsQuery.isLoading) {
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

    // if CSV file is Uploaded
    if (variants === VARIANTS.IMPORT) {
        return <ImportCard data={importResults.data} onSubmit={() => { }} onCancel={onCancelImport} />
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transaction history
                    </CardTitle>

                    <div className="flex flex-col lg:flex-row gap-y-2 items-center space-x-2">

                        <Button size="sm" onClick={newTransaction.onOpen} className="w-full lg:w-auto">
                            <Plus className="size-4 mr-2" />
                            Add New
                        </Button>

                        <UploadButton onUpload={onUpload} />

                    </div>
                </CardHeader>

                {/* Dislpaying the Table */}
                <CardContent>
                    <div className="container mx-auto py-10">
                        <DataTable
                            columns={columns}
                            data={transactions}
                            filterKey="payee"
                            onDelete={(row) => {
                                const ids = row.map((r) => r.original.id)
                                deleteTransactions.mutate({ ids })
                            }}
                            disabled={isDisabled}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default TransactionsPage