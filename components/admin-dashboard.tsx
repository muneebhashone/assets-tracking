"use client";

import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { User } from "@/types/services/auth.types";

import { NavItem } from "@/types/user.types";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";

interface DashboardNavProps {
  items: NavItem[];
  user?: User;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function AdminDashboardNav({ items, setOpen, user }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items?.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href
                    ? "bg-accent text-black"
                    : "transparent text-white",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
