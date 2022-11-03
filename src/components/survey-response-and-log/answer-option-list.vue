<template>
  <div class="answer-option-list">
    <div v-for="(item, index) in answerOptionList" :key="index">
      <div class="answer-option" v-if="isRadioButton">
        <label :for="index">
          <input type="radio" :disabled="isLog" :checked="isCheckedAnswer(item)" :value="item" @change="checkAnswer($event)" :name="questionId"/>
        </label>
        <div>{{item}}</div>
      </div>
      <div class="answer-option" v-else-if="isCheckbox">
        <label :for="index">
          <input type="checkbox" :disabled="isLog" :checked="isCheckedAnswer(item)" :value="item" @change="checkAnswer($event)" :name="questionId"/>
        </label>
        <div>{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { QUESTION_TYPES } from '@/const/index';
import { $responseStore, $surveyStore } from '@/store';

@Component({})
export default class AnswerOptionList extends Vue {
  // region prop
  @Prop( { type: String }) questionId!: string;
  @Prop( { type: Boolean }) isLog!: boolean;
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  // get userName() {
  //   return this.$route.params.userName;
  // }

  get answerType() {
    const foundIndex = $surveyStore.survey.questionList.findIndex((i) => i.questionId === this.questionId);
    return $surveyStore.survey.questionList[foundIndex].answerType;
  }

  get answerOptionList() {
    const foundIndex = $surveyStore.survey.questionList.findIndex((i) => i.questionId === this.questionId);
    return $surveyStore.survey.questionList[foundIndex].answerOptionList;
  }
  get isRadioButton() {
    return this.answerType === QUESTION_TYPES.YES_NO || this.answerType === QUESTION_TYPES.ONE_CHOICE;
  }

  get isCheckbox() {
    return this.answerType === QUESTION_TYPES.MULTIPLE_CHOICE;
  }
  // endregion

  // region method
  checkAnswer(e: MouseEvent) {
    const selected = e.target as HTMLInputElement;
    $responseStore.fetchUpdateQuestionAnswer({ questionId: this.questionId, selectedAnswer: selected.value });
    console.log('response', $responseStore.response);
  }

  isCheckedAnswer(item: string) {
    if (this.$route.name === '개별 로그') {
      const foundAnswerIndex = $responseStore.logDetail.questionAnswer.findIndex((i) => i.questionId === this.questionId);
      console.log('foundAnswerIndex', foundAnswerIndex);
      console.log('about questtionId', this.questionId);
      return $responseStore.logDetail.questionAnswer[foundAnswerIndex].answer.includes(item);
    }
    return;
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  created() {
    console.log('logDetail in answerOptionList', $responseStore.logDetail);
    console.log('survey data in answerOptionList', $surveyStore.survey);
  }
  // endregion
}
</script>
