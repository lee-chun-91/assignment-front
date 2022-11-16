<template>
  <div class="not-found">
    <div class="not-found__title">404 Not Found</div>
    <div class="not-found__description">잘못된 접근입니다</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class PageNotFound extends Vue {}
</script>
