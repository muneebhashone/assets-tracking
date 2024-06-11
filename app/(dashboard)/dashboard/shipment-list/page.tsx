"use client";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ROLE } from "@/types";
import { useCurrentUser } from "../../../../services/auth.mutations";

const ShipmentList = () => {
  const { data: currentUser } = useCurrentUser();

  return (
    <ScrollArea className="h-full ">
      {currentUser?.user ? (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <UserDashboard />
        </div>
      ) : null}
    </ScrollArea>
  );
};

export default ShipmentList;
