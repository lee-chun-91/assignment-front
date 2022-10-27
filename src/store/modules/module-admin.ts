import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
// import { userApi } from '@/apis/userApi';
import router from '@/router';
import { userApi } from '@/apis/userApi';

export interface IAdminInfo {
  username: string,
  password: string,
}

@Module({ namespaced: true, name: 'admin' })
export default class ModuleAdmin extends VuexModule {
  // 초기값
  isLogin = false;

  @Mutation
  private login() {
    this.isLogin = true;
  }

  @Mutation
  private logout() {
    this.isLogin = false;
    localStorage.removeItem('access_token');
  }

  @Action({ rawError: true })
  public async fetchLogin(userInfo: IAdminInfo) {
    return new Promise((resolve, reject) => {
      userApi.adminLogin(userInfo)
        .then((res) => {
          localStorage.setItem('accessToken', res.data);
          this.login();
          router.push( { name: 'adminMain' });
        })
        .catch((error) => {
          reject(error.response.data); });
    });
  }

  // @Action
  // public loginCheck() {
  //   if (localStorage.getItem('accessToken')) {
  //     return;
  //   } else {
  //     router.push({
  //       name: 'signIn'
  //     });
  //   }
  // }
}
