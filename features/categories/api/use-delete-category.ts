import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/hono"
import { toast } from "sonner";
import { styleText } from "util";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>

export const useDeleteCategories = (id?: string) => {
    const queryClient = useQueryClient()
    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.categories[":id"]["$delete"]({ param: { id } })
            return await response.json()

        },

        onSuccess: () => {
            toast.success("Category deleted successfully")
            queryClient.invalidateQueries({
                queryKey: ["categories", { id }]
            }),
                queryClient.invalidateQueries({
                    queryKey: ["categories"]
                })

        },
        onError: (error) => {
            toast.error("Error deleting categories")
            console.error(error)
        },
    })
    return mutation
}