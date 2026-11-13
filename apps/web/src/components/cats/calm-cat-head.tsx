"use client";

import { Cat3D } from "@/components/cats/cat-3d";

type CalmCatHeadProps = {
  className?: string;
  size?: number;
};

export function CalmCatHead({ className, size = 120 }: CalmCatHeadProps) {
  return (
    <Cat3D
      className={className}
      mood="calm"
      part="head"
      size={size}
    />
  );
}
