"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger }
    from "@/components/ui/dropdown-menu"

import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction"
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction"

import UseConfirm from "@/hooks/use-confirm"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

type Props = {
    id: string
}

const Actions = ({ id }: Props) => {
    const { onOpen, onClose } = useOpenTransaction()
    const deleteMutation = useDeleteTransaction(id)
    

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