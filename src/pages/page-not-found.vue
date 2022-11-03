<template>
  <div class="not-found">
    <div class="not-found__title">404 Not Found</div>
    <div class="not-found__description">잘못된 페이지 접근입니다</div>
    <div class="not-found__a--goBack"><router-link :to="{ path: '/'}">메인으로 돌아가기</router-link></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class PageNotFound extends Vue {}
</script>
