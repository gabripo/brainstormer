import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "preferred" | "mediator";
  className?: string;
}

const variantStyles = {
  default: "bg-gray-100 text-gray-700",
  preferred: "bg-amber-100 text-amber-800 border border-amber-300",
  mediator: "bg-primary/10 text-primary border border-primary/30",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
