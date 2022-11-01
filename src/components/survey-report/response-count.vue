<template>
  <div class="response-count">
    <div>{{title}}</div>
    <div>{{count}} 명</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class ResponseCount extends Vue {
  // region prop
  @Prop ( { type: String, required: true }) title!: string;
  @Prop ( { type: Number, required: true }) count!: number;
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
