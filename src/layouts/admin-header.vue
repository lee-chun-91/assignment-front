<template>
  <div class="admin-header">
    <div class="admin-header__title">
      <h2>설문조사 관리자</h2>
      <p>
        xxx님 안녕하세요
        <a>로그아웃</a>
      </p>
    </div>
    <div class="admin-header__breadcrumb">
      <div>admin > </div>
      <button>설문지 추가</button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';

@Component({})
export default class AdminHeader extends Vue {
  // region prop
  // endregion

  // region local
  // endregion

  // region computed
  // endregion

  // region method
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
