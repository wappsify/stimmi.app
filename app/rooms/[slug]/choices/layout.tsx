import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function RoomSubpageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid gap-4">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="sm:place-self-start"
      >
        <Link href="./">
          <ArrowLeft />
          Back to room overview
        </Link>
      </Button>
      {children}
    </div>
  );
}

export default RoomSubpageLayout;
