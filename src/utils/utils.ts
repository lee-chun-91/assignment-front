

// date 값 변환
export const convertDate = (date: Date) => {
  const YY = date.getFullYear();
  const MM = date.getMonth() + 1;
  const DD = date.getDate();
  const hh = date.getHours();
  const mm = date.getMinutes();
  return YY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm;
};


// date 값 같은 날인지 비교
export const isSameDate = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate();
};


// chart.js 에서 요구하는 data 모양에 맞추어 변환해주는 함수
const init:{ [index:string]: number } = {};
export const getElementCount = (arr: string[]) => arr.reduce((ac, v) => ({ ...ac, [v]: (ac[v] || 0) + 1 }), init);


// random rgb 값을 반환해주는 함수
export const getRandomColor = () =>
  `rgb( ${new Array(3).fill('')
    .map(v => Math.floor(Math.random() * 256)).join(', ')} )`;


// uuid 를 생성해주는 함수
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

export const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
