<template>
  <div class="sign-in">
    <h1 class="sign-in-title">설문지 시스템</h1>
    <AtomicInput title="id" placeholder="id를 입력해주세요" :value="userName" @handle-input="updateId"></AtomicInput>
    <AtomicInput title="password" placeholder="password를 입력해주세요" :value="password" @handle-input="updatePassword"></AtomicInput>
    <el-button type="success" name="로그인" @click="login" round>로그인</el-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AtomicButton from '@/components/sign-in/atomic-button.vue';
import AtomicInput from '@/components/sign-in/atomic-input.vue';
import { $adminStore } from '@/store';

@Component({
  components: { AtomicButton, AtomicInput },
})
export default class PageSignIn extends Vue {
  // region prop
  // endregion

  // region local
  userName = '';
  password = '';
  // endregion

  // region computed
  // endregion

  // region method
  updateId(value: string) {
    this.userName = value;
  }

  updatePassword(value: string) {
    this.password = value;
  }

  login() {
    $adminStore.fetchLogin({ userName: this.userName, password: this.password })
      .catch((error) => {
        this.$alert(error, '로그인 오류', {
          confirmButtonText: 'OK',
        });
      });
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
