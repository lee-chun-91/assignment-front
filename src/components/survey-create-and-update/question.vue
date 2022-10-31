<template>
  <div class="question">
    <label for="질문내용"></label>
    <input type="text" id="질문내용" className="question__input"  placeholder="질문을 입력해주세요"
           name="questionName" :value="questionName" @input="updateQuestionName(questionId, $event)"/>
    <select name="questionType" :value="answerType" @change="updateAnswerType(questionId, $event)">
      <option value="0">YES/NO</option>
      <option value="1">단일선택</option>
      <option value="2">다중선택</option>
    </select>
    <answer-list :questionId="questionId"></answer-list>
    <el-button type="danger" icon="el-icon-delete" circle @click="deleteQuestion"></el-button>
  </div>
</template>

<script lang="ts">

import AnswerList from '@/components/survey-create-and-update/answer-option-list.vue';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { $surveyStore } from '@/store';

@Component({
  components: { AnswerList }
})
export default class Question extends Vue {
  // region prop
  @Prop( { type: String }) questionId!: string
  // endregion

  // region local
  // endregion

  // region computed
  get questionName() {
    const foundIndex = $surveyStore.survey.questionList.findIndex((i) => i.questionId === this.questionId);
    return $surveyStore.survey.questionList[foundIndex].questionName;
  }

  get answerType() {
    const foundIndex = $surveyStore.survey.questionList.findIndex((i) => i.questionId === this.questionId);
    return $surveyStore.survey.questionList[foundIndex].answerType;
  }
  // endregion

  // region method
  updateQuestionName(questionId: string, e: InputEvent) {
    if (!e.target) {
      return;
    }
    const eventTarget = e.target as HTMLInputElement;
    const questionName = eventTarget.value;
    $surveyStore.fetchUpdateQuestionName({ questionId: this.questionId, questionName });
  }

  updateAnswerType(questionId: string, e: Event) {
    if (!e.target) {
      return;
    }
    const eventTarget = e.target as HTMLSelectElement;
    const answerType = Number(eventTarget.value);
    $surveyStore.fetchUpdateAnswerType({ questionId: this.questionId, answerType });
  }

  deleteQuestion() {
    $surveyStore.fetchDeleteQuestion(this.questionId);
  }
  // endregion
}
</script>
