<template>
  <div class="question-list">
    <div class="question" v-for="({ questionId, questionName, answerType, answerOptionList }, index) in questionList" :key="questionId">
      <div class="question__title">질문{{index}}. {{questionName}}</div>
      <div class="question__description">{{description(answerType)}}</div>
      <answer-option-list :isLog="isLog" :answerOptionList="answerOptionList" :questionId="questionId"></answer-option-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { $surveyStore } from '@/store';
import AnswerOptionList from '@/components/survey-response-and-log/answer-option-list.vue';
import { QUESTION_TYPES } from '@/const/index';

@Component({
  components: { AnswerOptionList }
})
export default class QuestionList extends Vue {
  // region prop
  @Prop( { type: Boolean }) isLog?: boolean;
  // endregion
  // region local
  // endregion

  // region computed
  get questionList() {
    return $surveyStore.survey.questionList;
  }
  // endregion

  // region method
  description(answerType: number) {
    if (answerType === QUESTION_TYPES.YES_NO || answerType === QUESTION_TYPES.ONE_CHOICE) {
      return '하나의 답변을 선택해주세요.';
    }
    else if (answerType === QUESTION_TYPES.MULTIPLE_CHOICE) {
      return '여러 개의 답변을 선택할 수 있습니다.';
    }
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
