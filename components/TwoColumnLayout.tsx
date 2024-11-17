import { ReactNode } from "react";
import Image from "next/legacy/image";

interface TwoColumnLayoutProps {
  children: ReactNode;
  imageSrc: string;
  imageAlt: string;
}

export function TwoColumnLayout({
  children,
  imageSrc,
  imageAlt,
}: TwoColumnLayoutProps) {
  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-gray-100 p-4">
        {children}
      </div>
      <div className="relative hidden md:block">
        <Image src={imageSrc} alt={imageAlt} layout="fill" objectFit="cover" />
      </div>
    </div>
  );
}
