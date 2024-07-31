import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs"
import HeaderLogo from "./HeaderLogo"
import Navigation from "./Navigation"
import { Loader2 } from "lucide-react"
import WelcomeMsg from "./WelcomeMsg"

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-blue-600 to-blue-500 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <div>
            <ClerkLoaded>
              <UserButton />
            </ClerkLoaded>

            <ClerkLoading>
              <Loader2 className="size-8 animate-spin" />
            </ClerkLoading>
          </div>
        </div>
        <WelcomeMsg />
      </div>
    </header>
  )
}

export default Header