"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface OrderBySelectorProps {
  paramKey?: string;
}

export function OrderBySelector({
  paramKey = "orderBy",
}: OrderBySelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentOrder = searchParams.get(paramKey) || "desc";

  const handleOrderChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={currentOrder} onValueChange={handleOrderChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select order" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="asc">Ascending</SelectItem>
        <SelectItem value="desc">Descending</SelectItem>
      </SelectContent>
    </Select>
  );
}
