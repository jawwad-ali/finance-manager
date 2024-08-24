import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ImportTable from "./import-table"
import { convertAmountToMiliUnits } from "@/lib/utils"
import { format, parse } from "date-fns"

type Props = {
    data: string[][]
    onCancel: () => void
    onSubmit: (data: any) => void
}

const dateFormat = "yyyy-MM-dd HH:mm:ss"
const outputFormat = "yyyy-MM-dd"

const requiredOptions = [
    "date",
    "amount",
    "payee"
]

interface SelectedColumnState {
    [key: string]: string | null
}

const ImportCard = ({ data, onCancel, onSubmit }: Props) => {

    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>({})
    const headers = data[0]
    // getting the entire data
    const body = data.slice(1)

    const onTableHeadSelect = (columnIndex: number, value: string | null) => {
        setSelectedColumns((prev: any) => {
            // Making a copy
            const newSelectedColumns = { ...prev }

            for (const key in newSelectedColumns) {
                // This ensures that the same value isn't selected for multiple columns.
                if (newSelectedColumns[key] === value) {
                    newSelectedColumns[key] = null
                }
            }
            if (value === "skip") {
                value == null
            }
            newSelectedColumns[`column_${columnIndex}`] = value
            return newSelectedColumns
        })
    }

    const progress = Object.values(selectedColumns).filter(Boolean).length

    const handleContinue = () => {
        const getColumnIndex = (column: string) => {
            return column.split("_")[1]
        }

        const mappedData = {
            headers: headers.map((header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`)
                return selectedColumns[`column_${columnIndex}`] || null
            }),

            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    const columnIndex = getColumnIndex(`column_${index}`)
                    return selectedColumns[`column_${columnIndex}`] ? cell : null
                })
                return transformedRow.every((item) => item === null) ? [] : transformedRow
            }).filter((row) => row.length > 0)
        }

        // Only getting the selected data. Eleminating the data that has the value null so database can have only populated     values and not the null values.
        const arrayofData = mappedData.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index]
                if (header !== null) {
                    acc[header] = cell
                }
                return acc
            }, {})
        })
        console.log({ arrayofData })

        const formattedData = arrayofData.map((item) => ({
            ...item,
            amount: convertAmountToMiliUnits(parseFloat(item.amount)),
            date: format(parse(item.date, dateFormat, new Date()), outputFormat)
        }))

        onSubmit(formattedData)
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Import Transition
                    </CardTitle>

                    <div className="flex items-center space-x-2 flex-col lg:flex-row gap-y-2 gap-x-2">

                        <Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            disabled={progress < requiredOptions.length}
                            onClick={handleContinue}
                            className="w-full lg:w-auto"
                        >
                            Continue ({progress} / {requiredOptions.length})
                        </Button>
                    </div>
                </CardHeader>

                {/* Dislpaying the Table */}
                <CardContent>
                    <ImportTable
                        headers={headers}
                        body={body}
                        selectedColumns={selectedColumns}
                        onTableHeadSelectChange={onTableHeadSelect}
                    />

                </CardContent>
            </Card>
        </div >
    )
}

export default ImportCard