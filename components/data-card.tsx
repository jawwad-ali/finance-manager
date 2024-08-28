import { cva, VariantProps } from "class-variance-authority"
import { cn, formatPercentage } from "@/lib/utils"
import { IconType } from "react-icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { CountUp } from "./count-up"

const boxVariant = cva(
    "rounded-md p-3",
    {
        variants: {
            variant: {
                default: "bg-blue-500/20",
                success: "bg-emrald-500/20",
                danger: "bg-rose-500/20",
                warning: "bg-yellow-500/20",
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

const iconVariant = cva(
    "size-6",
    {
        variants: {
            variant: {
                default: "fill-blue-500",
                success: "fill-emrald-500",
                danger: "fill-rose-500",
                warning: "fill-yellow-500",
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

type BoxVariant = VariantProps<typeof boxVariant>
type IconVariant = VariantProps<typeof iconVariant>

interface DataCardProps extends BoxVariant, IconVariant {
    icon: IconType
    title: string
    dateRange: string
    value?: number
    percentageChange?: number
}

const DataCard = ({ icon: Icon, value = 0, dateRange, title, percentageChange = 0, variant }: DataCardProps) => {
    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-x-4">
                <div className="space-y-2">

                    <CardTitle className="text-2xl line-clamp-1">
                        {title}
                    </CardTitle> 
                    <CardDescription className="line-clamp-1">
                        {dateRange}
                    </CardDescription>
                </div>
                <div className={cn(boxVariant({ variant }), "flex items-center justify-center rounded-full")}>
                    <Icon className={cn(iconVariant({ variant }))} />
                </div>
            </CardHeader>

            <CardContent>
                <h1 className="break-all font-bold text-2xl mb-2 line-clamp-1">
                    $ <CountUp
                        preserveValue
                        start={0}
                        end={value} 
                        decimals={2}
                        decimalPlaces={2}
                    // formattingFn={formatCurrency}
                    />
                </h1>
                <p className={cn("text-muted-foreground text-sm line-clamp-1",
                    percentageChange > 0 && "text-emerald-500",
                    percentageChange < 0 && "text-rose-500s")}>
                    {formatPercentage(percentageChange, { addPrefix: true })} from last period
                </p>
            </CardContent>
        </Card >
    )
}

export default DataCard