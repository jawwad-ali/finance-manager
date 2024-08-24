import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono"
import { useSearchParams } from "next/navigation";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetTransactions = () => {
    const params = useSearchParams()
    const from = params.get("from") || ""
    const to = params.get("to") || ""
    const accountId = params.get("accountId") || ""

    const query = useQuery({
        queryKey: ['transactions', { from, to, accountId }],
        queryFn: async () => {
            // Getting it from query parameters
            const res = await client.api.transactions.$get({
                query: {
                    from,
                    to,
                    accountId
                }
            }) 

            //Handling Error 
            if (!res.ok) {
                throw new Error('Failed to fetch transactions')
            }

            const { data } = await res.json()
            return data.map((transaction: any) => ({
                ...transaction,
                amount: convertAmountFromMiliunits(transaction.amount)
            }))
        }
    })
    return query
}