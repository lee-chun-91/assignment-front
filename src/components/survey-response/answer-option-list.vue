<template>
  <div class="answer-option-list">
    <div v-for="(item, index) in answerOptionList" :key="index">
      <div class="answer-option" v-if="isRadioButton">
        <label :for="index">
          <input type="radio" :value="item" @change="checkAnswer($event)" :name="questionId"/>
        </label>
        <div>{{item}}</div>
      </div>
      <div class="answer-option" v-else-if="isCheckbox">
        <label :for="index">
          <input type="checkbox" :value="item" @change="checkAnswer($event)" :name="questionId"/>
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
  @Prop( { type: String }) questionId!: string
  // endregion

  // region local
  // checked = '';
  // checkList = [];
  // endregion

  // region computed
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
    console.log(selected.value);
    console.log(selected);
    console.log(this.questionId);
    // $responseStore.fetchUpdateQuestionAnswer({ questionId: this.questionId, answer: selected.value });
  }

  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
