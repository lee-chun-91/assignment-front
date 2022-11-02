<template>
  <div class="atomic-button">
    <button>{{ name }}</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class AtomicButton extends Vue {
  // region prop
  @Prop({ type: String }) name!: string;
  // endregion
}
</script>
