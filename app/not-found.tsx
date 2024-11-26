import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">
        404 - Page Not Found
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Button variant="default" asChild>
        <Link href="/" passHref>
          Return Home
        </Link>
      </Button>
    </div>
  );
}
