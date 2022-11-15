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
<!--    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">-->
<!--      <el-breadcrumb-item :to="{ path: '/' }">메인</el-breadcrumb-item>-->
<!--      <div v-for="(matched, idx) in routeMatchedList" :key="idx">-->
<!--        <el-breadcrumb-item :to="{ path: `${matched.path}` }">{{matched.name}}</el-breadcrumb-item>-->
<!--      </div>-->
<!--    </el-breadcrumb>-->
    <div class="breadcrumb">
      <router-link :to="{ path: '/main' }">메인</router-link>
      <span v-for="(matched, idx) in routeMatchedList"
            :key="idx">
        <router-link :to="{ path: `${matched.path}` }">{{matched.name}}</router-link>
        <span v-if="hasNextRoute(idx)"> > </span>
        </span>
    </div>
    <div class="page-wrapper">
      <slot></slot>
<!--      <router-view></router-view>-->
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

  hasNextRoute(idx: number) {
    const matchedListLength = this.routeMatchedList.length;
    return idx !== matchedListLength - 1 && this.$route.name !== undefined;
  }
  // endregion

  created() {
    console.log(this.$route);
  }
}
</script>
