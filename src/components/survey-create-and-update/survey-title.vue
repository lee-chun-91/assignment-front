<template>
  <div class="survey-create-and-update survey-title">
    <el-form-item prop="surveyName">
      <el-input class="survey-create-and-update survey-title__input"
                type="text"
                placeholder="제목 없는 설문지"
                :value="survey.surveyName"
                @input="updateSurveyName($event)"
      >
      </el-input>
    </el-form-item>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { $surveyStore } from '@/store';
import { ISurvey } from '@/store/modules/module-survey';

@Component({})
export default class SurveyTitle extends Vue {
  // region prop
  @Prop ( { type: Object as () => ISurvey }) survey!: ISurvey
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
