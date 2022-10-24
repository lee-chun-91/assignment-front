<template>
  <div className="atomic-button">
    <button>{{ name }}</button>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';

@Component({})
export default class AtomicButton extends Vue {
  // region prop
  @Prop({ type: String }) name!: string;
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
