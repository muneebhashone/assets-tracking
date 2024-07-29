import { apiAxios } from "@/utils/api.utils";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ErrorResponseType } from "./types.common";
import { PaginatorInfoType } from "./user.queries";
import { useCurrentUser } from "./auth.mutations";
import { User } from "@/types/services/auth.types";

//types
export type GetAllShipmentsInputType = {
  searchString: string;
  limitParam: number;
  pageParam: number;
  tags?: string[];
  trackWith?: TrackWithType;
};

export type GetSharedShipmentInputType = {
  token: string;
};

export type GetAllShipmentsResponseType = {
  results: Shipment[];
  paginatorInfo: PaginatorInfoType;
};

export type GetShipmentByIdInput = {
  shipmentId: number;
};
export type GetShipmentByIdResponse = {
  result: Shipment;
};

export type GetSharedShipmentResponseType = {
  data: Shipment;
  status: string;
};
export const trackWithEnums = ["CONTAINER_NUMBER", "MBL_NUMBER"] as const;
export const SHIPMENT_PROGRESS_STATUSES = {
  IN_PROGRESS: "IN_PROGRESS",
  FOUND: "FOUND",
  NOT_FOUND: "NOT_FOUND",
  QUEUED: "QUEUED",
  INSUFFICIENT_CREDITS: "INSUFFICIENT_CREDITS",
} as const;
export type TrackWithType = (typeof trackWithEnums)[number];
export type ShipmentProgressStatusType =
  keyof typeof SHIPMENT_PROGRESS_STATUSES;

export type ShipmentStatus = "PLANNED" | "IN_TRANSIT" | "DELIVERED" | "UNKNOWN";

export type Shipment = {
  id: number;
  status: ShipmentStatus | null;
  carrier: string;
  aggregator: string | null;
  arrivalTime: string | null;
  createdAt: string;
  sealine: string | null;
  containerNo: string;
  mblNo: string;
  user: User;
  trackWith: TrackWithType;
  type: string | null;
  companyId: string | null;
  creatorId: number;
  referenceNo: string;
  followers: string[];
  tags: string[];
  progress: ShipmentProgressStatusType;
  shareFiles: boolean;
  isTracking: boolean;
  files: string[];
  shareToken?: string;
};

//services
export const getShipments = async (input: GetAllShipmentsInputType) => {
  const { data } = await apiAxios.get<GetAllShipmentsResponseType>(
    "/shipments",
    {
      params: { ...input },
    },
  );

  return data;
};

export const getShipmentById = async (input: GetShipmentByIdInput) => {
  const { shipmentId } = input;
  const { data } = await apiAxios.get<GetShipmentByIdResponse>(
    `/shipments/${shipmentId}/id`,
  );

  return data;
};

export const viewSharedShipment = async (input: GetSharedShipmentInputType) => {
  const { token } = input;
  const { data } = await apiAxios.get<GetSharedShipmentResponseType>(
    "/shipments/share/view-shipment",
    {
      params: { token },
    },
  );
  return data;
};

//hooks
export const useGetShipments = (
  input: GetAllShipmentsInputType,
  options?: UseQueryOptions<
    unknown,
    ErrorResponseType,
    GetAllShipmentsResponseType
  >,
) => {
  const { data: user } = useCurrentUser();
  return useQuery({
    ...options,
    queryFn: async () => await getShipments(input),
    queryKey: ["getShipments", user?.user.id, JSON.stringify(input)],
    refetchInterval: 900000,
    enabled: Boolean(user?.user.id),
  });
};

export const useGetShipmentById = (
  input: GetShipmentByIdInput,
  options?: UseQueryOptions<
    unknown,
    ErrorResponseType,
    GetShipmentByIdResponse
  >,
) => {
  const { data: user } = useCurrentUser();
  return useQuery({
    ...options,
    queryFn: async () => await getShipmentById(input),
    queryKey: ["getShipmentById", user?.user.id, JSON.stringify(input)],
    enabled: Boolean(user?.user.id),
  });
};

export const useGetSharedShipment = (
  input: GetSharedShipmentInputType,
  options?: UseQueryOptions<
    unknown,
    ErrorResponseType,
    GetSharedShipmentResponseType
  >,
) => {
  const { data: user } = useCurrentUser();
  return useQuery({
    ...options,
    queryFn: async () => await viewSharedShipment(input),
    queryKey: ["viewSharedShipment", user?.user.id, JSON.stringify(input)],
    enabled: Boolean(user?.user.id),
  });
};
