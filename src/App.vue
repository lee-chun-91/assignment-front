<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/_index.scss';
</style>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';

@Component({})
export default class App extends Vue {
}
</script>
