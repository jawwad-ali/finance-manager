import CurrencyInput from "react-currency-input-field"
import { Info, MinusCircle, PlusCircle, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import { parse } from "path"

type Props = {
    value: string
    onChange: (value: string | undefined) => void
    placeholder?: string
    disabled?: boolean
}

const AmountInput = ({ onChange, value, disabled, placeholder }: Props) => {
    const parsedValue = parseFloat(value)
    const Income = parsedValue > 0
    const Expense = parsedValue < 0

    // If user wants to make income a Expense or vice-versa 
    const onReverseValue = () => {
        if (!value) return
        const newValue = parseFloat(value) * -1
        onChange(newValue.toString())
    }

    return (
        <div className="relative">
            <TooltipProvider>
                <Tooltip deplayDuration={100}>
                    <TooltipTrigger asChild>
                        <button type="button" onClick={onReverseValue}
                            className={cn(
                                "bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition",
                                Income && "bg-emerald-500 hover:bg-emerald-600",
                                Expense && "bg-rose-500 hover:bg-rose-600"
                            )}
                        >
                            {!parsedValue && <Info className="size-3 text-white" />}
                            {Income && <PlusCircle className="size-3 text-white" />}
                            {Expense && <MinusCircle className="size-3 text-white" />}
                        </button>
                    </TooltipTrigger>

                    <TooltipContent>
                        Use [+] for Income and [-] for expenses
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <CurrencyInput prefix="$" className="flex h-10 pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 "
                placeholder={placeholder}
                value={value}
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={onChange}
                disabled={disabled}
            />
            <p className="text-xs text-muted-foreground mt-2">
                {Income && "This is an income source"}
                {Expense && "This is an expense"}
            </p>
        </div>
    )
}

export default AmountInput