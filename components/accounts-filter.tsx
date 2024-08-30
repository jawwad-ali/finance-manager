"use client"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useGetSummary } from "@/features/summary/api/use-get-summary"
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select"
import qs from "query-string"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

const AccountsFilter = () => {
    const params = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    // get accounts
    const { data: accounts, isLoading: isAccountsLoading } = useGetAccounts()
    // get summary
    const { data: summary, isLoading: isSummaryLoading } = useGetSummary()

    const accountId = params.get("accountId") || "all"
    const from = params.get("from") || ""
    const to = params.get("to") || ""

    const onChange = (newValue: string) => {
        const query = {
            accountId: newValue,
            from,
            to
        }
        if (newValue === "all") {
            query.accountId = ""
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query
        }, { skipNull: true, skipEmptyString: true })
        router.push(url)
    }

    return (
        <Select value={accountId} onValueChange={onChange} disabled={isAccountsLoading || isSummaryLoading}>
            <SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
                <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">
                    All Accounts
                </SelectItem>
                {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default AccountsFilter