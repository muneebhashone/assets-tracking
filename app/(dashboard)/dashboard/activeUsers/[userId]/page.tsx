import { userData } from "@/actions/usersActions";
import ActiveUsers, { paramsProps } from "@/components/ActiveUsers";
import { User } from "@prisma/client";



export default async function Page({ params }: paramsProps) {
  const { userId } = params
  const data = await userData(userId) as User

  return (
    <ActiveUsers params={params} user={data} />
  )
}
