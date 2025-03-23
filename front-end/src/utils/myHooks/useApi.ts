import { useCallback, useMemo, useState } from "react";
import API from "../axiosConfig";
import { z } from "zod";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export default function useApi<T>(
  url: string,
  schema: z.ZodType<T>,
  method: "get" | "post" | "patch" | "delete" = "get",
  customErrors?: { [key: number]: string }
) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const errors = useMemo(() => {
    return {
      400: "Invalid data.",
      401: "Invalid credentials.",
      403: "Forbidden.",
      404: "Not found.",
      429: "Too many requests.",
      500: "Server error. <br /> Please try again later.",
      ...customErrors,
    };
  }, [customErrors]);

  const fetchData = useCallback(
    async (options?: AxiosRequestConfig) => {
      setLoading(true);
      setErrorMsg("");

      try {
        let finalUrl = url;

        if (method === "get" && options?.params) {
          const query = new URLSearchParams(options.params).toString();
          finalUrl += `?${query}`;
          console.log(finalUrl);
        }

        const axiosOptions: AxiosRequestConfig = {
          ...options,
          method,
        };

        if (method !== "get" && options?.data) {
          axiosOptions.data = options.data;
        }

        const res: AxiosResponse<T> = await API.request({
          url: finalUrl,
          ...axiosOptions,
        });

        const dataRes = schema.safeParse(res.data);

        if (!dataRes.success) console.log(dataRes.error);
        return dataRes.data;
      } catch (err) {
        const { response } = err as AxiosError<T>;

        if (response) {
          const status = response.status as keyof typeof errors;
          setErrorMsg(errors[status] || "Sorry, something went wrong.");
        } else {
          setErrorMsg("Network error");
        }
      } finally {
        setLoading(false);
      }
    },
    [url, schema, method, errors]
  );

  return { loading, errorMsg, fetchData } as const;
}
