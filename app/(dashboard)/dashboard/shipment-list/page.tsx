"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentUser } from "../../../../services/auth.mutations";
import ShipmentPage from "@/components/page-client/ShipmentPage";

const ShipmentList = () => {
  const { data: currentUser } = useCurrentUser();

  return (
    <ScrollArea className="h-full ">
      {currentUser?.user ? (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <ShipmentPage />
        </div>
      ) : null}
    </ScrollArea>
  );
};

export default ShipmentList;
