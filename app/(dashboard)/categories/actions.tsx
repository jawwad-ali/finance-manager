"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger }
    from "@/components/ui/dropdown-menu"
import { useDeleteCategory } from "@/features/categories/api/use-delete-category"
import { useOpenCategory } from "@/features/categories/hooks/use-open-category"
import UseConfirm from "@/hooks/use-confirm"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

type Props = {
    id: string
}

const Actions = ({ id }: Props) => {
    const { onOpen, onClose } = useOpenCategory()
    const deleteMutation = useDeleteCategory(id)

    const onDelete = async () => {
        const ok = await confirm()
        if (ok) {
            deleteMutation.mutate()
        }
    }

    const [ConfirmationDialog, confirm] = UseConfirm("Are you sure?", "You are about to delete")

    return (
        <>
            <ConfirmationDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="size-8 p-0">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">

                    <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() => onOpen(id)}><Edit className="size-4 mr-2" />  Edit</DropdownMenuItem>

                    <DropdownMenuItem disabled={deleteMutation.isPending} onClick={onDelete}><Trash className="size-4 mr-2" />  Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default Actions