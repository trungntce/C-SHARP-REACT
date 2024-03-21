type TimeType = "day" | "hour" | "minute" | "second";

export const tenBelow = (value: any) => {
  if (Number(value) < 10) {
    return `0${value}`;
  }
  return value;
};

export const TimeFormat = (T: any) => {
  const now = new Date(T);
  let Year = now.getFullYear();
  let Mouth = tenBelow(now.getMonth() + 1);
  let Day = tenBelow(now.getDate());
  let Hour = tenBelow(now.getHours());
  let Minutes = tenBelow(now.getMinutes());
  let Seconds = tenBelow(now.getSeconds());
  return `${Year}-${Mouth}-${Day} ${Hour}:${Minutes}:${Seconds}`;
};

export const cur_befTime = (value: number, timeType: TimeType) => {
  const now = new Date();
  let before;
  switch (timeType) {
    case "day":
      before = new Date(now.setDate(now.getDate() - value));
      break;
    case "hour":
      before = new Date(now.setHours(now.getHours() - value));
      break;
    case "minute":
      before = new Date(now.setMinutes(now.getMinutes() - value));
      break;
    case "second":
      before = new Date(now.setSeconds(now.getSeconds() - value));
      break;
  }
  return TimeFormat(before);
};

export const afterTime = (value: number, timeType: TimeType) => {
  const now = new Date();
  let after;
  switch (timeType) {
    case "day":
      after = new Date(now.setDate(now.getDate() + value));
      break;
    case "hour":
      after = new Date(now.setHours(now.getHours() + value));
      break;
    case "minute":
      after = new Date(now.setMinutes(now.getMinutes() + value));
      break;
    case "second":
      after = new Date(now.setSeconds(now.getSeconds() + value));
      break;
  }
  return TimeFormat(after);
};

export const SearchDate = () => {
  const now = new Date();
  const NowHour = now.getHours();
  if (NowHour < 8) {
    return TimeFormat(new Date(now.setDate(now.getDate() - 1)));
  }
  return TimeFormat(new Date());
};

export const convertMillisecondsToHoursMinutesSeconds = (milliseconds: any) => {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor(((milliseconds % 360000) % 60000) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
};
