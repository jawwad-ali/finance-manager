import { useOpenCategory } from "@/features/categories/hooks/use-open-category"
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction"
import { cn } from "@/lib/utils"
import { TriangleAlert } from "lucide-react"

type Props = {
    id: string
    categoryId: string | null 
    category: string | null
}

const CateogoryColumn = ({ id, category, categoryId }: Props) => {
    const { onOpen: onOpenCategory } = useOpenCategory()
    const { onOpen: onOpenTransaction } = useOpenTransaction()
 
    const onClick = () => {
        if (categoryId) {
            onOpenCategory(categoryId)
        }
        else {
            onOpenTransaction(id)
        }
    }

    return (
        <div
            onClick={onClick}
            className={cn("flex items-center cursor-pointer hover:underline",
                !category && "text-rose-500"
            )}
        >
            {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
            {category ? category : "Uncategorized"}
        </div>
    )
}

export default CateogoryColumn