<template>
  <div class="not-found">
    <div class="not-found--title">404 Not Found</div>
    <div class="not-found--title-secondary"><router-link :to="{ path: '/'}">메인으로 돌아가기</router-link></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class PageNotFound extends Vue {}
</script>
