import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold mb-4">Welcome to stimmi</h1>
      <p className="text-lg text-gray-700 mb-6">
        Your personalized app experience is coming soon!
      </p>
      <div className="flex space-x-4">
        <Button variant="default" size="lg" asChild>
          <Link href="/register">Register</Link>
        </Button>
        <Button variant="default" size="lg" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
