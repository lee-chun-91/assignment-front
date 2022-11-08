const getCookie = (name: string) : string|undefined => {
  const value = '; ' + document.cookie;
  const parts: string[] | undefined = value.split(`; ${name}=`);

  if (parts.length === 2) {
    // array.pop() 이 undefined 를 잠재하고 있어서 as string 을 써서 우회
    const item = parts.pop() as string;
    return item.split(';').shift();
  }
  else return undefined;
};

const setCookie = (name: string, value: string) => {
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 60 * 24 ); // 1일
  document.cookie = `${name}=${value}; expires=${date}`;
};


const deleteCookie = (name: string) => {
  const date = new Date('2020-01-01').toUTCString();
  document.cookie = name + '=; expires=' + date;
};

export { getCookie, setCookie, deleteCookie };
