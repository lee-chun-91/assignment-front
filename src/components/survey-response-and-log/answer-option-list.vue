<template>
  <div class="answer-option-list">
    <div class="answer-option__wrapper" v-for="(item, index) in answerOptionList" :key="index">
      <div class="answer-option" v-if="isRadioButton">
        <label :for="index">
          <input type="radio" :disabled="isLog" :checked="isCheckedAnswer(item)" :value="item" @change="checkAnswer($event)" :name="questionId"/>
        </label>
        <div class="answer-option__content">{{item}}</div>
      </div>
      <div class="answer-option" v-else-if="isCheckbox">
        <label :for="index">
          <input type="checkbox" :disabled="isLog" :checked="isCheckedAnswer(item)" :value="item" @change="checkAnswer($event)" :name="questionId"/>
        </label>
        <div class="answer-option__content">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { QuestionTypes } from '@/enum/question-types';
import { $responseStore, $surveyStore } from '@/store';
import { PageNames } from '@/enum/page-names';

@Component({})
export default class AnswerOptionList extends Vue {
  // region prop
  @Prop( { type: String, required: true }) questionId!: string;
  @Prop( { type: Boolean }) isLog?: boolean;
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  get answerType() {
    const foundIndex = $surveyStore.survey.questionList.findIndex((i) => i.questionId === this.questionId);
    return $surveyStore.survey.questionList[foundIndex].answerType;
  }

  get answerOptionList() {
    const foundIndex = $surveyStore.survey.questionList.findIndex((i) => i.questionId === this.questionId);
    return $surveyStore.survey.questionList[foundIndex].answerOptionList;
  }
  get isRadioButton() {
    return this.answerType === QuestionTypes.yesNo || this.answerType === QuestionTypes.oneChoice;
  }

  get isCheckbox() {
    return this.answerType === QuestionTypes.multipleChoice;
  }
  // endregion

  // region method
  checkAnswer(e: MouseEvent) {
    const selected = e.target as HTMLInputElement;
    $responseStore.fetchUpdateQuestionAnswer({ questionId: this.questionId, selectedAnswer: selected.value });
    console.log('response', $responseStore.response);
  }

  isCheckedAnswer(answerOption: string) {
    // 개별 로그 페이지일 때만 로직 진행
    if (this.$route.name === PageNames.surveyLogDetail) {
      // 1. 질문 id 값 같은 아이템 찾기
      const foundAnswerIndex = $responseStore.logDetail.questionAnswer.findIndex((i) => i.questionId === this.questionId);

      // 2.1. 질문 id 값 같은 아이템이 없다면(유저가 해당 질문에 대해 응답한 적이 없다면) false return
      if (foundAnswerIndex === -1) return false;

      // 2.2. 질문 id 값 같은 아이템 있다면, 그 질문에 대한 응답 Array 에 answerOption 이 포함되어 있는지 체크하여 return
      else {
        return $responseStore.logDetail.questionAnswer[foundAnswerIndex].answer.includes(answerOption);
      }
    }
    return;
  }
  // endregion
}
</script>
