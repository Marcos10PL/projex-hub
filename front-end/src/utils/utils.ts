import { differenceInCalendarDays } from "date-fns";
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

export function daysUpdated(date: string) {
  const days = Math.abs(differenceInCalendarDays(new Date(date), new Date()));

  const res = " (updated ";
  if (days === 0) return res + "today)";
  if (days === 1) return res + "yesterday)";
  if (days > 1) return res + `${days} days ago)`;
}

export function daysOverdue(date: string) {
  const days = Math.abs(differenceInCalendarDays(new Date(date), new Date()));

  return ` (${days} days overdue)`;
}
