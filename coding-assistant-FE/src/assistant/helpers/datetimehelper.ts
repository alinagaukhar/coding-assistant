import {
  getYear,
  isThisYear,
  isToday,
  isYesterday,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfYear,
  startOfYesterday,
} from 'date-fns';

export interface DateCategory {
  dateType: string;
  startOfDate: Date;
}

export const categorizeDate = (created_ts: Date): DateCategory => {
  if (isToday(created_ts)) {
    return {
      dateType: 'Today',
      startOfDate: startOfToday(),
    };
  } else if (isYesterday(created_ts)) {
    return {
      dateType: 'Yesterday',
      startOfDate: startOfYesterday(),
    };
  } else if (isThisYear(created_ts)) {
    return {
      dateType: `${created_ts.toLocaleString('en-US', { month: 'long' })}`,
      startOfDate: startOfDay(startOfMonth(created_ts)),
    };
  } else {
    return {
      dateType: `${getYear(created_ts)}`,
      startOfDate: startOfDay(startOfYear(created_ts)),
    };
  }
};
