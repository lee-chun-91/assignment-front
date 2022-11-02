<template>
  <div class="atomic-input">
    <label :for="title"></label>
    <input class="atomic-input__input" type="text" :id="title" :placeholder="placeholder" :value="value"
           @input="handleInput"/>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';

@Component({})
export default class AtomicInput extends Vue {
  // region prop
  @Prop({ type: String }) readonly title!: string
  @Prop({ type: String }) readonly placeholder!: string
  @Prop({ type: String }) value!: string
  // endregion

  // region emit
  @Emit()
  handleInput(event: InputEvent) {
    if (!event.target) {
      return;
    }
    const eventTarget = event.target as HTMLInputElement;
    return eventTarget.value;
  }
  // endregion
}
</script>
