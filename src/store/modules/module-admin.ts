import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import router from '@/router';
import { adminApi } from '@/apis/adminApi';
import { deleteCookie, getCookie, setCookie } from '@/utils/cookie';
import { PageRouteNames } from '@/enum/page-names';

export interface IAdminInfo {
  userName: string,
  password: string,
}

export interface IBackAdminInfo {
  user_name: string,
  password: string,
}


@Module({ namespaced: true, name: 'admin' })
export default class ModuleAdmin extends VuexModule {
  // 초기값
  userName = '';
  isLogin = false;

  @Mutation
  private login(userName: string) {
    this.userName = userName;
    this.isLogin = true;
  }

  @Mutation
  private logout() {
    this.userName = '';
    this.isLogin = false;
  }

  @Mutation
  private setLoggedInfo(userName: string) {
    this.userName = userName;
    this.isLogin = true;
  }

  // ---------------------------MUTATION END----------------------------



  // ---------------------------ACTION START----------------------------

  @Action ({ rawError: true })
  public async fetchLogin(userInfo: IAdminInfo) {
    const backUserInfo: IBackAdminInfo = {
      user_name: userInfo.userName,
      password: userInfo.password,
    };
    return await adminApi.adminLogin(backUserInfo)
      .then((res) => {
        setCookie('accessToken', res.data);
        setCookie('userName', userInfo.userName);
        if (history) {
          history.back();
        }
        // router.push( { name: PageRouteNames.adminMain });
      });
    // .catch((error) => {
    //   return Promise.reject(error.response.data);});
  }



  @Action
  public fetchLogout() {
    deleteCookie('accessToken');
    deleteCookie('userName');

    this.logout();
    router.push( { name: PageRouteNames.signIn });
  }

  @Action
  public fetchSetLoggedInfo() {
    const userName = getCookie('userName');
    const token = getCookie('accessToken');

    if (userName && token) {
      this.setLoggedInfo(userName);
    }
  }
}
