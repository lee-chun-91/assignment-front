const getCookie = (name: string) => {
  const value = '; ' + document.cookie;
  const parts: string[] = value.split(`; ${name}=`);

  if (parts.length === 2) {
    // array.pop() 이 undefined 를 잠재하고 있어서 as string 을 써서 우회
    const item = parts.pop() as string;
    return item.split(';').shift();
  }
};

const setAccessCookie = (token: string) => {
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 60 * 24); // 1일
  document.cookie = `accessToken=${token}; expires=${date}`;
};

const setUserNameCookie = (userName: string) => {
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 60 * 24); // 1일
  document.cookie = `userName=${userName}; expires=${date}`;
};


const deleteCookie = (name: string) => {
  const date = new Date('2020-01-01').toUTCString();
  document.cookie = name + '=; expires=' + date;
};

export { getCookie, setAccessCookie, setUserNameCookie, deleteCookie };
