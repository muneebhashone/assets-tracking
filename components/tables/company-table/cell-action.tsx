"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Company } from "@/services/companies.queries";


import { MoreHorizontal, Trash, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

interface CellActionProps {
  data: Company;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // const [loading, setLoading] = useState(false);
  // const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/company/${data.id}`)}
          >
            <Wrench className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("here")}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
          {/* <DropdownMenuItem >
            <Trash className="mr-2 h-4 w-4" /> Details
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
// onClick={() => setOpen(true)}
// /dashboard/activeUsers/${data.id}
