"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    SortingState,
    Row,
    VisibilityState,
} from "@tanstack/react-table"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import UseConfirm from "@/hooks/use-confirm"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ArrowBigDown, ChevronDown, Trash } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterKey: string
    onDelete: (row: Row<TData>[]) => void
    disabled?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey, 
    onDelete,
    disabled
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    // ConFirmation
    const [ConfirmationDialog, confirm] = UseConfirm("Are you sure?", "You are about to perform bulk delete")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,

        state: {
            sorting,
            columnFilters,
            rowSelection,
            columnVisibility,
        },
    })

    return (
        <div>
            {/* Confirmation Dialog box */}
            <ConfirmationDialog />

            <div className="lg:flex items-center py-4">
                {/* Search Bar */}
                <Input
                    placeholder={`Filter ${filterKey}...`}
                    value={(table.getColumn(`${filterKey}`)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(`${filterKey}`)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                {/* Visibility Buttons */}
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto w-full lg:w-auto mt-2 lg:mt-0">
                            <ChevronDown className="size-4 mr-2" />
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) => column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Delete Button if a certain row is selected */}
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <Button disabled={disabled} size="sm" variant={"outline"} className="ml-auto font-normal text-xs"
                        onClick={async () => {
                            const ok = await confirm()

                            if (ok) {
                                onDelete(table.getFilteredSelectedRowModel().rows)
                                table.resetRowSelection()
                            }
                        }}>
                        <Trash className="size-4 mr-2"
                        />
                        Delete ({table.getFilteredSelectedRowModel().rows.length})
                    </Button>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                {/* Numbers of Row Selected */}
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                {/* Pagination Buttons */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
