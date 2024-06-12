import React, { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}
export const Badge = (props: BadgeProps) => {
  const { children, ...options } = props;
  
  return (
    <span
      className={`ml-2 ${options?.className} text-white px-2 py-1 rounded-sm text-sm`}
      {...options}
    >
      {children}
    </span>
  );
};
