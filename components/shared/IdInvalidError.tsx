'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const IdInvalidError = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-4">
      <div className="relative w-[350px] h-[350px]">
        <Image
          src="/images/broken-link.jpg" // Intentionally wrong to test fallback
          alt="Page not available"
          width={350}
          height={350}
          onError={(e) => {
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                  <span class="text-gray-500">Image not found</span>
                </div>
              `;
            }
          }}
        />
      </div>
      <h2 className="text-2xl font-bold my-4">This page isn&apos;t available!</h2>
      <p className="text-gray-500 mb-4">
        The link may be broken, or the page may have been removed.
      </p>
      <Link href="/shop">
        <Button>Go to Shop Page</Button>
      </Link>
    </div>
  );
};

export default IdInvalidError;