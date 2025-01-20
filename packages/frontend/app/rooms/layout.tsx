import { Header } from "@/components/header";

function RoomsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="px-4">
        <main className="container mx-auto">{children}</main>
      </div>
    </>
  );
}

export default RoomsLayout;
