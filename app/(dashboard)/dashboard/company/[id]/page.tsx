import { userData } from "@/actions/usersActions";
import CompanyCredit, { paramsProps } from "@/components/CompanyInsert";

import { User } from "@prisma/client";

export default async function Page({ params }: paramsProps) {
  const { id } = params;
  //   const data = (await userData(userId)) as User;

  return <CompanyCredit params={params} />;
}
