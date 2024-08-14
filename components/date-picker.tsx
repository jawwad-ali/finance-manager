import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { SelectSingleEventHandler } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

type Props = {
    value?: Date
    onChange?: SelectSingleEventHandler
    disabled?: boolean
}

const DatePicker = ({ value, onChange, disabled }: Props) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button disabled={disabled} variant={"outline"} className={
                    cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")
                }>
                    <CalendarIcon className="size-4 mr-2" />
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange} /*disabled={disabled}*/
                    disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker