<template>
  <div class="survey-title">
    <h1 class="survey-title__content">{{surveyName}}</h1>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import { $surveyStore } from '@/store';

@Component({})
export default class SurveyTitle extends Vue {

  // region prop
  // endregion

  // region local
  // endregion

  // region computed
  get surveyName() {
    return $surveyStore.survey.surveyName;
  }
  // endregion

  // region method
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
