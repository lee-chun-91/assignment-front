<template>
  <div class="sign-in">
    <h1 class="sign-in__title">설문지 시스템</h1>
    <div class="sign-in__body">
      <AtomicInput class="sign-in__input" type="text" title="id" placeholder="id를 입력해주세요" :value="userName" @handle-input="updateId"></AtomicInput>
      <AtomicInput class="sign-in__input" type="password" title="password" placeholder="password를 입력해주세요" :value="password" @handle-input="updatePassword"></AtomicInput>
      <el-button class="sign-in__button" type="success" name="로그인" @click="login">로그인</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AtomicInput from '@/components/sign-in/atomic-input.vue';
import { $adminStore } from '@/store';

@Component({
  components: { AtomicInput },
})
export default class PageSignIn extends Vue {
  // region local
  userName = '';
  password = '';
  // endregion

  // region method
  updateId(value: string) {
    this.userName = value;
  }

  updatePassword(value: string) {
    this.password = value;
  }

  login() {
    $adminStore.fetchLogin({ userName: this.userName, password: this.password });
  }
  // endregion
}
</script>
