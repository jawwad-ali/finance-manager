import { SignUp, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen grid gird-cols-1 lg:grid-cols-2 border">
      {/* Left Side */}
      <div className="h-full lg:flex flex-col items-center justify-center px-4 border">
        <div className="text-center space-y-4 pt-16">
          <h1>Welcome Back!</h1>
          <p className="text-base text-[#7e8ca0]">Log in or Create account to get back to your dashboard</p>
        </div>

        <div className="flex items-center justify-center mt-8">
          {/* SignUp component will only show when loading has complete */}
          <ClerkLoaded>
            <SignUp />
          </ClerkLoaded>

          {/* There will be a loading spinner until the clerk is Loading. */}
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground" />
          </ClerkLoading>
        </div> 
      </div>

      {/* Right Side */}
      <div className="h-full hidden lg:flex items-center justify-center">
        <Image src="/logo.jpeg" height={700} width={700} alt="finance-manager-app" />
      </div>
    </div>
  )
}