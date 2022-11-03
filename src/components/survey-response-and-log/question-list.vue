<template>
  <div class="question-list">
    <div class="question" v-for="{ questionId, questionName, answerOptionList } in questionList" :key="questionId">
      <div class="question__title">{{questionName}}</div>
      <answer-option-list :isLog="isLog" :answerOptionList="answerOptionList" :questionId="questionId"></answer-option-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { $surveyStore } from '@/store';
import AnswerOptionList from '@/components/survey-response-and-log/answer-option-list.vue';

@Component({
  components: { AnswerOptionList }
})
export default class QuestionList extends Vue {
  // region prop
  @Prop( { type: Boolean }) isLog!: boolean;
  // endregion
  // region local
  // endregion

  // region computed
  get questionList() {
    return $surveyStore.survey.questionList;
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
