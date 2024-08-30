import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = ["#0062FF", "#12C6FF", "#FF647F", "#FF9354"]

type Props = {
    data?: {
        name: string
        value: number
    }[]
}

const PieChartVariant = ({ data }: Props) => {
    console.log("piechartvar" , data)
    return (
        <ResponsiveContainer>
            <PieChart>
                <Legend />
                <Pie 
                    data={data}
                    cx={"50%"}
                    cy={"50%"}
                    outerRadius={90}
                    innerRadius={60}
                    paddingAngle={2}
                    fill={"#8884d8"}
                    dataKey={"value"}
                    labelLine={false}
                >
                    {data?.map((_entry, idx) => (
                        <Cell
                            key={`cell-${idx}`}
                            fill={COLORS[idx % COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    )
}

export default PieChartVariant