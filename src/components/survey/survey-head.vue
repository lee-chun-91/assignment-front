<template>
  <div class="survey-title">
    <label for="설문지 제목"></label>
    <input type="text" id="설문지 제목" className="survey-title__input" placeholder="제목 없는 설문지"
           name="title" :value="surveyName" @input="updateSurveyName"/>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import { $surveyStore } from '@/store';

@Component({})
export default class SurveyHead extends Vue {

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
  updateSurveyName(e: InputEvent) {
    if(!e.target) {
      return;
    }
    const eventTarget = e.target as HTMLInputElement;
    $surveyStore.fetchUpdateSurveyName(eventTarget.value);
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
