import ShipmentComponent from "@/components/ShipmentComponent";
import { getAllSeaRatesContainer } from "@/services/searates";

const page = async () => {
  const data = await getAllSeaRatesContainer();
  return <ShipmentComponent data={data} />;
};
export default page;
