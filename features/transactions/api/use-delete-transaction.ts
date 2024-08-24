import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/hono"
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>

export const useDeleteTransaction = (id?: string) => {
    const queryClient = useQueryClient()
    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions[":id"]["$delete"]({ param: { id } })
            return await response.json()
        },

        onSuccess: () => {
            toast.success("Transaction deleted successfully")
            queryClient.invalidateQueries({
                queryKey: ["transaction", { id }]
            })
            queryClient.invalidateQueries({
                queryKey: ["transactions"]
            })

        },
        onError: (error) => {
            toast.error("Error deleting transaction")
            console.error(error)
        },
    })
    return mutation
}