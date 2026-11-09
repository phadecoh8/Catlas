"use client";

import { Cat3D } from "@/components/cats/cat-3d";

type HappyCatProps = {
  className?: string;
  size?: number;
};

export function HappyCat({ className, size = 120 }: HappyCatProps) {
  return <Cat3D className={className} mood="happy" size={size} />;
}
