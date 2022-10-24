<template>
  <div class="sign-in">
    <AtomicInput title="id" placeholder="id를 입력해주세요" :inputValue="id.value" @handle-input="updateId"></AtomicInput>
    <AtomicInput title="password" placeholder="password를 입력해주세요" :inputValue="password.value" @handle-input="updatePassword"></AtomicInput>
    <AtomicButton name="로그인"></AtomicButton>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import AtomicButton from '@/components/sign-in/atomic-button.vue';
import AtomicInput from '@/components/sign-in/atomic-input.vue';

@Component({
  components: { AtomicButton, AtomicInput },
})
export default class PageSignIn extends Vue {
  // region prop
  // endregion

  // region local
  id= {
    value: '',
    isValid: false,
  }

  password = {
    value: '',
    isValid: false,
  }
  // endregion

  // region computed
  // endregion

  // region method
  updateId(value: string) {
    this.id.value = value;
  }

  updatePassword(value: string) {
    this.password.value = value;
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
