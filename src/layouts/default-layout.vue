<template>
  <div class="default-layout">
    <admin-header></admin-header>
    <router-view></router-view>
  </div>

</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import AdminHeader from '@/layouts/admin-header.vue';

@Component({
  components: { AdminHeader }
})
export default class DefaultLayout extends Vue {
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
