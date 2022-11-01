

export const convertDate = (date: Date) => {
  const YY = date.getFullYear();
  const MM = date.getMonth() + 1;
  const DD = date.getDate();
  const hh = date.getHours();
  const mm = date.getMinutes();
  return YY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm;
};

export const isSameDate = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate();
};

//
const init:{ [index:string]: number } = {};
export const getElementCount = (arr: string[]) => arr.reduce((ac, v) => ({ ...ac, [v]: (ac[v] || 0) + 1 }), init);


//
export const getRandomColor = () =>
  `rgb( ${new Array(3).fill('')
    .map(v => Math.floor(Math.random() * 256)).join(', ')} )`;


//
export const uuid = () => {
  let uuidValue = '', k, randomValue;
  for (k = 0; k < 32;k++) {
    randomValue = Math.random() * 16 | 0;

    if (k == 8 || k == 12 || k == 16 || k == 20) {
      uuidValue += '-';
    }
    uuidValue += (k == 12 ? 4 : (k == 16 ? (randomValue & 3 | 8) : randomValue)).toString(16);
  }
  return uuidValue;
};
