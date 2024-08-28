"use client"

import { useGetSummary } from "@/features/summary/api/use-get-summary"
import { formatDateRange } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
// import PiggyBank from "react-icons"
import { FaArrowTrendDown, FaArrowTrendUp, FaPiggyBank } from "react-icons/fa6";
import DataCard from "./data-card"
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const DataGrid = () => {
    const { data, isLoading } = useGetSummary()

    const params = useSearchParams()
    const to = params.get("to") || undefined
    const from = params.get("from") || undefined
    const dateRangeLabel = formatDateRange({ to, from })

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
                <DataLoading />
                <DataLoading />
                <DataLoading />
            </div> 
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
            <DataCard
                title="Remaining"
                value={data?.remainingAmount}
                percentageChange={data?.remainingChange}
                icon={FaPiggyBank}
                variant="default"
                dateRange={dateRangeLabel}
            />
            <DataCard
                title="Income"
                value={data?.incomeAmount}
                percentageChange={data?.incomeChange}
                icon={FaArrowTrendUp}
                variant="default"
                dateRange={dateRangeLabel}
            />
            <DataCard
                title="Expenses"
                value={data?.expenseAmount}
                percentageChange={data?.expenseChange}
                icon={FaArrowTrendDown}
                variant="default"
                dateRange={dateRangeLabel}
            />
        </div>
    )
}

export default DataGrid

export const DataLoading = () => {
    return (
        <Card className="border-none drop-shadow-sm h-[192px]">
            <CardHeader className="flex flex-row items-center justify-between gap-x-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="size-12" />
            </CardHeader>
            <CardContent>
                <Skeleton className="shrink-0 h-10 w-24 mb-2" />
                <Skeleton className="shrink-0 h-4 w-40" />
            </CardContent>
        </Card>
    )
}