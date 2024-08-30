import { useState } from "react"
import { FileSearch, Radar, PieChart, Target } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AreaVariant from "./area-variant";
import BarChartVariant from "./bar-chart";
import LineChartVariant from "./line-variant";
import PieChartVariant from "./pie-chart";

type Props = {
    data?: {
        name: string
        value: number
    }[]
}

const SpendingPie = ({ data = [] }: Props) => {
    const [chartType, setChartType] = useState("pie")

    const onTypeChange = (type: string) => {
        setChartType(type)
    }

    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <CardTitle className="text-xl line-clamp-1">
                    Categories
                </CardTitle>
                {/* TODO: add select */}

                <Select defaultValue={chartType} onValueChange={onTypeChange}>
                    <SelectTrigger className="w-[180px] lg:w-auto h-9 rounded-md px-3">
                        <SelectValue placeholder="Select a chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pie">
                            <div className="flex items-center">
                                <PieChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">Pie Chart</p>
                            </div>
                        </SelectItem>
                        <SelectItem value="radar">
                            <div className="flex items-center">
                                <Radar className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">Radar Chart</p>
                            </div>
                        </SelectItem>
                        <SelectItem value="radial">
                            <div className="flex items-center">
                                <Target className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">Radial Chart</p>
                            </div>
                        </SelectItem>
                    </SelectContent>

                </Select>

            </CardHeader>
            <CardContent>
                {
                    data.length === 0 ? (
                        <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
                            <FileSearch className="size-6 text-muted-foreground" />
                            <p className="text-muted-foreground text-sm">
                                No data available
                            </p>
                        </div>
                    ) : (
                        <>
                            {chartType === "pie" && <PieChartVariant data={data} />}
                            {/* {chartType === "radar" && <AreaVariant data={data} />}
                            {chartType === "radial" && <BarChartVariant data={data} />} */}
                        </>
                    )
                }
            </CardContent>
        </Card>
    )
}

export default SpendingPie