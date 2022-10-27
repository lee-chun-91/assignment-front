<template>
  <div class="admin-header">
    <div class="admin-header__title">
      <h2>설문조사 관리자</h2>
      <p>
        {{ username }}님 안녕하세요
        <el-button size="mini" @click="logout">로그아웃</el-button>
      </p>
    </div>
    <div class="admin-header__breadcrumb">
      <div>admin > </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import { $adminStore } from '@/store';

@Component({})
export default class AdminHeader extends Vue {
  // region prop
  // endregion

  // region local
  // endregion

  // region computed
  get username() {
    return $adminStore.username;
  }
  // endregion

  // region method
  logout() {
    $adminStore.fetchLogout();
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
