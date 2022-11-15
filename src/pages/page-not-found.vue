<template>
  <div class="not-found">
    <div class="not-found__title">404 Not Found</div>
    <div class="not-found__description">잘못된 접근입니다</div>
<!--    <div class="not-found__a&#45;&#45;goBack"><router-link :to="goBack">뒤로 돌아가기</router-link></div>-->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import router from '@/router';

@Component({})
export default class PageNotFound extends Vue {

  // region method
  // goBack() {
  //   return router.go(-2);
  // }
  // endregion
}
</script>
