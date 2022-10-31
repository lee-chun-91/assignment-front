export const convertDate = (date: Date) => {
  const YY = date.getFullYear();
  const MM = date.getMonth() + 1;
  const DD = date.getDate();
  const hh = date.getHours();
  const mm = date.getMinutes();
  return YY + '년 ' + MM + '월 ' + DD + '일 ' + hh + '시 ' + mm + '분 ';
};
