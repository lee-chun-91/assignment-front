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

import AnswerList from '@/components/survey-create/answer-option-list.vue';
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
    const foundIndex = $surveyStore.survey.question_list.findIndex((i) => i.question_id === this.questionId);
    return $surveyStore.survey.question_list[foundIndex].question_name;
  }

  get answerType() {
    const foundIndex = $surveyStore.survey.question_list.findIndex((i) => i.question_id === this.questionId);
    return $surveyStore.survey.question_list[foundIndex].answer_type;
  }
  // endregion

  // region method
  updateQuestionName(questionId: string, e: InputEvent) {
    if (!e.target) {
      return;
    }
    const eventTarget = e.target as HTMLInputElement;
    const questionName = eventTarget.value;
    $surveyStore.fetchUpdateQuestionName({ question_id: this.questionId, question_name: questionName });
  }

  updateAnswerType(questionId: string, e: Event) {
    if (!e.target) {
      return;
    }
    const eventTarget = e.target as HTMLSelectElement;
    const answerType = Number(eventTarget.value);
    $surveyStore.fetchUpdateAnswerType({ question_id: this.questionId, answer_type: answerType });
  }

  deleteQuestion() {
    $surveyStore.fetchDeleteQuestion(this.questionId);
  }
  // endregion
}
</script>
