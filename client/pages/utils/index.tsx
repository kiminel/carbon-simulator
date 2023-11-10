export const getYearDifference = (startDate: Date, endDate: Date) => {
  const oneDayMs = 1000 * 60 * 60 * 24;
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / oneDayMs);
  const years = Math.floor(diffDays / 365);
  return years;
};

export const getCurrentFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month: string | number = today.getMonth() + 1;
  let day: string | number = today.getDate();

  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }

  return `${year}-${month}-${day}`;
};
