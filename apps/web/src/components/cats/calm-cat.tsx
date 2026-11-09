"use client";

import { Cat3D } from "@/components/cats/cat-3d";

type CalmCatProps = {
  className?: string;
  size?: number;
};

export function CalmCat({ className, size = 120 }: CalmCatProps) {
  return <Cat3D className={className} mood="calm" size={size} />;
}
