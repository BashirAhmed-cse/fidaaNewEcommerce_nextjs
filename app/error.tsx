"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-4">
      <Image
        src="/images/error.png"
        alt="Something went wrong"
        width={350}
        height={350}
        priority
      />
      <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-3">
        Something went wrong!
      </h2>
      <div className="flex gap-4">
        <Button onClick={reset}>Try Again</Button>
        <Link href="/shop">
          <Button variant="outline">Go to Shop Page</Button>
        </Link>
      </div>
    </div>
  );
}
