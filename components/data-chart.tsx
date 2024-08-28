"use client"

import { useGetSummary } from "@/features/summary/api/use-get-summary"
import { DataLoading } from "./data-grid"
import Chart from "./Chart"

const DataChart = () => {
    const { data, isLoading } = useGetSummary()

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
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                <Chart data={data?.days} />
            </div>
        </div>
    )
}

export default DataChart