import API from "./axiosConfig";
import { apiResponseSchema } from "./zodSchemas";

export const resendEmail = async (email: string) => {
  try {
    const res = await API.post("auth/resend-confirm-email", { email });
    const dataRes = apiResponseSchema.safeParse(res.data);

    if (dataRes.data?.success) {
      return true;
    }
    // eslint-disable-next-line
  } catch (err) {
    // console.log(err);
    return false;
  }
};
