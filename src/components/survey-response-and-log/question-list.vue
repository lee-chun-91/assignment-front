<template>
  <div class="question-list">
    <div class="question" v-for="({ questionId, questionName, answerType, answerOptionList }, index) in questionList" :key="questionId">
      <div class="question__title">질문{{index}}. {{questionName}}</div>
      <div class="question__description">{{questionDescription(answerType)}}</div>
      <answer-option-list :isLog="isLog" :answerOptionList="answerOptionList" :questionId="questionId"></answer-option-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { $surveyStore } from '@/store';
import AnswerOptionList from '@/components/survey-response-and-log/answer-option-list.vue';
import { AnswerTypes } from '@/enum/answer-types';

@Component({ components: { AnswerOptionList } })
export default class QuestionList extends Vue {
  // region prop
  @Prop( { type: Boolean }) isLog?: boolean;
  // endregion

  // region computed
  get questionList() {
    return $surveyStore.survey.questionList;
  }
  // endregion

  // region method
  questionDescription(answerType: number) {
    if (answerType === AnswerTypes.yesNo || answerType === AnswerTypes.oneChoice) {
      return '하나의 답변을 선택해주세요.';
    }
    else if (answerType === AnswerTypes.multipleChoice) {
      return '여러 개의 답변을 선택할 수 있습니다.';
    }
  }
  // endregion
}
</script>
