<template>
  <div class="report-count">
    <div class="report-count__title">{{title}}</div>
    <div class="report-count__count">{{count}} 명</div>
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
}
</script>
