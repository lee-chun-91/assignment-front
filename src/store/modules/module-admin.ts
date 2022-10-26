import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
// import { userApi } from '@/apis/userApi';
import router from '@/router';

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

  @Action
  public fetchLogin() {
    // userApi.adminLogin().then(() => this.login());
  }

  @Action
  public loginCheck() {
    if (localStorage.getItem('accessToken')) {
      return;
    } else {
      router.push({
        name: 'signIn'
      });
    }
  }
}
