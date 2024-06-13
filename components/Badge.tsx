import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}
export const Badge = (props: BadgeProps) => {
  const { children, ...options } = props;
  const { className, ...rest } = options;

  return (
    <span
      className={cn("ml-2  text-white px-2 py-1 rounded-sm text-sm", className)}
      {...rest}
    >
      {children}
    </span>
  );
};
