import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function RoomSubpageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Button variant="outline" asChild>
        <Link href="/rooms">
          <ArrowLeft />
          Back to list of rooms
        </Link>
      </Button>
      {children}
    </>
  );
}

export default RoomSubpageLayout;
