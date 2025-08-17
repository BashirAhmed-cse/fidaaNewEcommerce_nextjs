'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NotFound() {
  const [imgSrc, setImgSrc] = useState("/images/notfound.png");

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-4">
      <div className="w-[600px] h-[600px] relative">
        <Image
          src={imgSrc}
          alt="Page not found"
          fill
          priority
          className="object-contain"
          onError={() => setImgSrc("/images/notfound.png")}
        />
      </div>
      <h2 className="text-3xl font-bold mt-6 mb-4 text-gray-800">
        PAGE NOT FOUND
      </h2>
      <Link href="/shop">
        <Button className="text-white bg-blue-600 hover:bg-blue-700">
          Go to Shop Page
        </Button>
      </Link>
    </div>
  );
}