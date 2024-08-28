import { Tooltip, XAxis, AreaChart, Area, ResponsiveContainer, CartesianGrid, Bar, BarChart } from "recharts"
import { format } from "date-fns"
import CustomTooltip from "./custom-tooltip"

type Props = {
    data: {
        date: string
        income: number
        expenses: number
    }[]
}

const BarChartVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width={'100%'} height={350}>
            <BarChart data={data}> 
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey={"date"}
                    tickFormatter={(value) => format(value, "dd MMM")}
                    style={{ fontSize: "12px" }}
                    tickMargin={16}
                />

                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#3b82f6" className="drop-shadow-sm" />
                <Bar dataKey="expenses" fill="#f43f5e" className="drop-shadow-sm" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default BarChartVariant