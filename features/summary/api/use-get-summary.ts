import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono"
import { useSearchParams } from "next/navigation";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetSummary = () => {
    const params = useSearchParams()
    const from = params.get("from") || ""
    const to = params.get("to") || ""
    const accountId = params.get("accountId") || "" 

    const query = useQuery({
        queryKey: ['summary', { from, to, accountId }],
        queryFn: async () => {
            // Getting it from query parameters
            const res = await client.api.summary.$get({
                query: {
                    from,
                    to,
                    accountId
                }
            })

            //Handling Error 
            if (!res.ok) {
                throw new Error('Failed to fetch summary')
            }

            const { data } = await res.json()
            return {
                ...data,
                incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
                expenseAmount: convertAmountFromMiliunits(data.expenseAmount),
                remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
                // category: data.categories.map((category: any) => ({
                //     ...category,
                //     expenseAmount: convertAmountFromMiliunits(category.value)
                // }))
                category: data.category.map((category: any) => ({
                    ...category,
                    expenseAmount: convertAmountFromMiliunits(category.value)
                })), 
                days: data.days.map((day: any) => ({
                    ...day, 
                    income: convertAmountFromMiliunits(day.income),
                    expense: convertAmountFromMiliunits(day.expense)
                }))
            }
        }
    })
    return query
}