"use client"
import { useNewAccount } from "@/features/accounts/hooks/use-new-account"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { columns, Payment } from "./columns"
import { DataTable } from "@/components/data-table"

const data: Payment[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "xyz@example.com",
    },
    {
        id: "728ed52f",
        amount: 250,
        status: "processing",
        email: "abc@example.com",
    }
]

const AccountsPage = () => {
    const newAccount = useNewAccount()
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
                <CardContent>
                    <div className="container mx-auto py-10">
                        <DataTable
                            columns={columns}
                            data={data}
                            filterKey="email"
                            onDelete={() => { }}
                            disabled={false}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AccountsPage

// 4.00.42