import ShipmentDetailPage from "@/components/page-client/ShipmentDetailPage";

interface PageProps {
  params: {
    [key: string]: string | undefined;
  };
}
export default async function Component(props: PageProps) {
  const { params } = props;
  if (params.id) {
    return <ShipmentDetailPage id={params.id} />;
  }
  return null;
}
