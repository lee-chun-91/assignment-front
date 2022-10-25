<template>
  <div class="question">
    <label for="질문내용"></label>
    <input type="text" id="질문내용" className="question__input"  placeholder="질문을 입력해주세요"
           name="questionName" :value="questionName" @input="updateQuestionName(questionId, $event)"/>
    <select name="questionType" @change="updateAnswerType(questionId, $event)">
      <option value="0">YES/NO</option>
      <option value="1">단일선택</option>
      <option value="2">다중선택</option>
    </select>
    <answer-list :questionId="questionId"></answer-list>
  </div>
</template>

<script lang="ts">

import AnswerList from '@/components/survey/answer-list.vue';
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { QUESTION_TYPES } from '@/const/index';
import { $surveyStore } from '@/store';

@Component({
  components: { AnswerList }
})
export default class QuestionContainer extends Vue {
  // region prop
  @Prop( { type: String }) questionId!: string
  // @Prop( { type: String }) questionName!: string
  // @Prop( { type: Number }) answerType!: number
  // @Prop( { type: Array }) answerOptionList!: []
  // endregion

  // region local
  // questionTypesYesNo = QUESTION_TYPES.YES_NO
  // questionTypesOneChoice = QUESTION_TYPES.ONE_CHOICE
  // questionTypesMultipleChoice = QUESTION_TYPES.MULTIPLE_CHOICE
  // endregion

  // region computed
  get questionName() {
    const foundIndex = $surveyStore.survey.questionList.findIndex((i) => i.id === this.questionId);
    return $surveyStore.survey.questionList[foundIndex].questionName;
  }
  // endregion

  // region method
  updateQuestionName(questionId: string, e: InputEvent) {
    console.log(e);
    console.log(e.target);
    if (!e.target) {
      return;
    }
    const eventTarget = e.target as HTMLInputElement;
    const questionName = eventTarget.value;
    $surveyStore.fetchUpdateQuestionName({ questionId, questionName });
  }

  updateAnswerType(questionId: string, e: Event) {
    if (!e.target) {
      return;
    }
    const eventTarget = e.target as HTMLSelectElement;
    const answerType = Number(eventTarget.value);
    $surveyStore.fetchUpdateAnswerType({ questionId, answerType });
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
