"use client";
import Filter, { OptionsMapperType } from "@/components/Filter";
import { useCurrentUser } from "@/services/auth.mutations";
import { RoleType } from "@/types/user.types";
import { EligibleRolesForCreation } from "@/utils/constants";

const page = () => {
  const { data: currentUser } = useCurrentUser();
  const optionsMapper: OptionsMapperType = {
    filterByActive: [true, false],
    filterByRole: EligibleRolesForCreation[currentUser?.user.role as RoleType],
    filterByStatus: ["REQUESTED", "APPROVED", "REJECTED"],
  };

  return (
    <>
      <Filter optionsMapper={optionsMapper} />
    </>
  );
};

export default page;
