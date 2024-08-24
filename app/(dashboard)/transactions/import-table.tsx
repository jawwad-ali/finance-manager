import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import TableHeadSelect from './table-head-select' 

type Props = {
    headers: string[]
    body: string[][]
    selectedColumns: Record<string, string | null> 

    // This can change the column name by clicking on the column
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void
} 

const ImportTable = ({ body, headers, onTableHeadSelectChange, selectedColumns }: Props) => {
    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((_item, index) => (
                            <TableHead key={index}>
                                {/* Custom component */}
                                <TableHeadSelect
                                    columnIndex={index}
                                    selectedColumns={selectedColumns}
                                    onChange={onTableHeadSelectChange}
                                />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex}>
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ImportTable