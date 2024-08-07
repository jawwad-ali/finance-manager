import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/hono"
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"]

export const useDeleteBulkCategories = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation< 
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"]["$post"]({ json })
            return await response.json() 

        },

        onSuccess: () => {
            toast.success("Category deleted")
            queryClient.invalidateQueries({
                queryKey: ["categories"]
                // Also invalidate Summary
            })
        },
        onError: (error) => {
            toast.error("Failed to Delete Categories")
            console.error(error)
        },
    })
    return mutation
}