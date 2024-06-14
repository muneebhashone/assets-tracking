import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const useQueryUpdater = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(name)) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params;
    },
    [searchParams],
  );

  const querySetter = (name: string, value: string) => {
    const newQueryString = createQueryString(name, value);
    router.push(pathname + "?" + newQueryString.toString());
  };

  return { querySetter };
};

export default useQueryUpdater;
