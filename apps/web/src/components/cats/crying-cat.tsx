"use client";

import { Cat3D } from "@/components/cats/cat-3d";

type CryingCatProps = {
  className?: string;
  size?: number;
  variant?: "crying" | "searching";
};

export function CryingCat({
  className,
  size = 120,
  variant = "crying",
}: CryingCatProps) {
  return (
    <Cat3D
      className={className}
      mood={variant}
      size={size}
    />
  );
}
