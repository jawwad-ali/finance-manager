import Header from "@/components/Header";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    <Header />
    <main className="px-3 lg:px-14">
      {children}
    </main>
    </>
  )}

export default DashboardLayout