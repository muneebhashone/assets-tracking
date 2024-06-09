import { apiAxios } from "@/utils/api.utils";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getAllShipments } from "@/actions/shipmentActions";
import { ErrorResponseType } from "./types.common";

export type GetAllShipmentsInputType = {
  searchString: string;
  limitParam: number;
  pageParam: number;
};

export type GetAllShipmentsResponseType = {
  results: Shipment[];
  paginatorInfo: PaginatorInfoType;
};

export type TrackWithType = "CONTAINER_NUMBER" | "MBL_NUMBER";

export type Shipment = {
  id: number;
  status: string | null;
  carrier: string;
  aggregator: string | null;
  arrivalTime: string | null;
  createdAt: Date;
  sealine: string | null;
  containerNo: string;
  mblNo: string;
  trackWith: TrackWithType;
  type: string | null;
  companyId: string | null;
  creatorId: number;
  referenceNo: string;
  followers: any[];
  tags: any[];
  progress: string;
  isTracking: boolean;
};

export type PaginatorInfoType = {
  skip: number;
  limit: number;
  currentPage: number;
  pages: number;
  hasNextPage: boolean;
  totalRecords: number;
  pageSize: number;
};

export const getShipments = async (input: GetAllShipmentsInputType) => {
  const { data } = await apiAxios.get<GetAllShipmentsResponseType>(
    "/shipments",
    { params: { ...input } },
  );

  return data;
};

export const useGetShipments = (
  input: GetAllShipmentsInputType,
  options?: UseQueryOptions<
    unknown,
    ErrorResponseType,
    GetAllShipmentsResponseType
  >,
) => {
  return useQuery({
    ...options,
    queryFn: async () => await getAllShipments(input),
    queryKey: [getAllShipments.name, JSON.stringify(input)],
  });
};
