<template>
  <div class="default-layout">
    <div class="header">
      <div class="header__title">
        <div class="header__logo"><router-link :to="{ path: '/'}">설문지 관리 시스템</router-link></div>
        <div class="header__logout">
          <p class="header__user">{{ userName }}님 안녕하세요</p>
          <el-button size="mini" @click="logout">로그아웃</el-button>
        </div>
      </div>
    </div>
    <div class="breadcrumb">
      <span v-for="(matched, idx) in routeMatchedList"
            :key="idx">
        <a
          :href="matched.path">
        {{ matched.name }}
        </a>
        <span v-if="hasNextroute(idx)"> > </span>
        </span>
    </div>
    <div class="page-wrapper">
      <router-view></router-view>
    </div>
  </div>

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { $adminStore } from '@/store';

@Component({})
export default class DefaultLayout extends Vue {
  // region computed
  get userName() {
    return $adminStore.userName;
  }

  get routeMatchedList() {
    return this.$route.matched;
  }
  // endregion

  // region method
  logout() {
    $adminStore.fetchLogout();
  }

  hasNextroute(idx: number) {
    const matchedListLength = this.routeMatchedList.length;
    return idx !== matchedListLength - 1 && this.$route.name !== undefined;
  }
  // endregion
}
</script>
