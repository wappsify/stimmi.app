import { Header } from "@/components/header";

function VotingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="px-4">
        <main className="max-w-lg mx-auto">{children}</main>
      </div>
    </>
  );
}

export default VotingLayout;
