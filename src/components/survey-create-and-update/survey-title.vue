<template>
  <div class="survey-create-and-update survey-title">
      <el-input class="survey-create-and-update survey-title__input"
                type="text"
                placeholder="제목 없는 설문지"
                :value="surveyName"
                @input="updateSurveyName($event)"
      >
      </el-input>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { $surveyStore } from '@/store';

@Component({})
export default class SurveyTitle extends Vue {
  // region prop
  // endregion

  // region computed
  get surveyName() {
    return $surveyStore.survey.surveyName;
  }
  // endregion

  // region method
  updateSurveyName(inputValue: string) {
    $surveyStore.fetchUpdateSurveyName(inputValue);
  }
  // endregion
}
</script>
