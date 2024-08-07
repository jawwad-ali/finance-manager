import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono"

export const useGetCategory = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ['categories', { id }],
        queryFn: async () => { 
            const res = await client.api.categories[":id"].$get({
                param: { id }
            })

            //Handling Error  
            if (!res.ok) {
                throw new Error('Failed to fetch categories ')
            }

            const { data } = await res.json()
            return data
        }
    })
    return query
}