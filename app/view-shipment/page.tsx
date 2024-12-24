import ViewShipmentPage from "@/components/page-client/ViewShipmentPage";
import { viewSharedShipment } from "@/services/shipment.queries";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}
const Page = async (props: PageProps) => {
  const { searchParams } = props;
  const token = searchParams["token"];
  if (!token) {
    redirect("/");
  }
  try {
    await viewSharedShipment({ token: token });
  } catch (error) {
    redirect("/");
  }

  return <ViewShipmentPage token={token} />;
};

export default Page;
