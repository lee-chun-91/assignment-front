<template>
  <div class="default-layout">
    <div class="header">
      <div class="header__title">
        <div class="header__logo"><router-link :to="{ path: '/'}">설문지 관리 시스템</router-link></div>
        <div class="header__logout">
          {{ userName }}님 안녕하세요
          <el-button size="mini" @click="logout">로그아웃</el-button>
        </div>
      </div>
    </div>
    <div class="breadcrumb">
      <div>admin > 기능 구현 필요</div>
    </div>

    <router-view></router-view>
  </div>

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { $adminStore } from '@/store';

@Component({})
export default class DefaultLayout extends Vue {
  // region prop
  // endregion

  // region local
  // endregion

  // region computed
  get userName() {
    return $adminStore.userName;
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
