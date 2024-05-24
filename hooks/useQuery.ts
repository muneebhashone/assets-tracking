import { getAllCompany } from "@/actions/companyActions";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 100;

export const useGetAllCompanies = (search?: string) => {
  return useQuery({
    queryKey: ["companies", search],
    queryFn: async () => {
      const res = await getAllCompany({
        limitParam: DEFAULT_LIMIT,
        pageParam: DEFAULT_PAGE,
        searchString: search || "",
      });
      return res;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
