import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { isEqual } from "lodash";

const useQueryUpdater = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string | string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (Array.isArray(value)) {
        for (const queryValue of value) {
          const alreadyPresent = params.getAll(name);
          if (!alreadyPresent.includes(queryValue)) {
            params.append(name, queryValue);
          }
        }
      } else {
        if (params.getAll(name).length) {
          params.delete(name, value);
        } else if (params.get(name) === value) {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      }

      return params;
    },
    [searchParams],
  );

  const querySetter = (name: string, value: string | string[]) => {
    const newQueryString = createQueryString(name, value);
    router.push(pathname + "?" + newQueryString.toString());
  };

  return { querySetter };
};

export default useQueryUpdater;
