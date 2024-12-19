import { Header } from "@/components/header";

function VotingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header hideNavigation={true} />
      <div className="px-4 mt-16">
        <main className="max-w-lg mx-auto">{children}</main>
      </div>
    </>
  );
}

export default VotingLayout;
