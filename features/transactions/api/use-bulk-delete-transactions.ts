import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/hono"
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"]

export const useDeleteBulkTransactions = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-delete"]["$post"]({ json })
            return await response.json()
        },

        onSuccess: () => {
            toast.success("Transactions deleted")
            queryClient.invalidateQueries({
                queryKey: ["transactions"]
                // Also invalidate Summary
            })
        },
        onError: (error) => {
            toast.error("Failed to Delete Transactions")
            console.error(error)
        },
    })
    return mutation
}