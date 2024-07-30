"use client"

import { usePathname, useRouter } from "next/navigation"
import NavButton from "./NavButton"
import { useMedia } from "react-use"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { useState } from "react"
import { Button } from "./ui/button"
import { Menu } from "lucide-react"

const routes = [
    {
        href: "/",
        label: "Dashboard"
    },
    {
        href: "/transactions",
        label: "Transactions"
    },
    {
        href: "/accounts",
        label: "Accounts"
    },
    {
        href: "/categoties",
        label: "Categories"
    },
    {
        href: "/settings",
        label: "Settings"
    }
]

const Navigation = () => {

    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const isMobile = useMedia("(max-width: 1024px)", false)

    const onClick = (href: string) => {
        router.push(href)
        setIsOpen(false)
    }

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                    <Button
                        variant={"outline"}
                        size="sm"
                        className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
                    >
                        <Menu className="size-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <nav className="flex flex-col gap-y-2 pt-6">
                        {routes.map((route) => (
                            <Button key={route.href} className="w-full justify-start" variant={route.href === pathname ? "secondary" : "ghost"}
                                onClick={() => onClick(route.href)}
                            >
                                {route.label}
                            </Button>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <nav className="lg:flex hidden items-center gap-x-2 overflow-x-auto">
            {routes.map((route) =>
                <NavButton
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    isActive={pathname === route.href}
                />
            )}
        </nav>
    )
}

export default Navigation
// 1.41.07