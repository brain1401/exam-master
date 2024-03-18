import dayjs from "dayjs";

export function dbDayjs(time?: string | Date) {
  if (time) {
    return dayjs(time).subtract(9, "hour").toDate();
  }
  return dayjs().add(9, "hour").toDate();
}
