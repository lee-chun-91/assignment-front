<template>
  <div class="answer-option-list">
    <div class="answer-option__wrapper" v-for="(item, index) in answerOptionList" :key="index">
      <div class="answer-option" v-if="isRadioButton">
        <label :for="index">
          <input type="radio" disabled="true"/>
          <input class="answer-option__input" type="text" :id="index" :value="item" @input="updateAnswerOption(questionId, index, $event)" />
          <el-button size="mini" circle :style="isShown" @click="deleteAnswerOption(questionId, index)"><i class="el-icon-delete"></i></el-button>
        </label>
      </div>
      <div class="answer-option" v-else-if="isCheckbox">
        <label :for="index">
          <input type="checkbox" disabled="true"/>
          <input class="answer-option__input" type="text" :id="index" :value="item" @input="updateAnswerOption(questionId, index, $event)" />
          <el-button size="mini" circle :style="isShown" @click="deleteAnswerOption(questionId, index)"><i class="el-icon-delete"></i></el-button>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { QUESTION_TYPES } from '@/const/index';
import { $surveyStore } from '@/store';

@Component({})
export default class AnswerOptionList extends Vue {
  // region prop
  @Prop( { type: String }) questionId!: string
  // endregion

  // region local
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

  get isShown() {
    const foundIndex = $surveyStore.survey.questionList.findIndex((i) => i.questionId === this.questionId);
    return ($surveyStore.survey.questionList[foundIndex].answerOptionList.length > 2) ?
      { 'visibility': 'visible' } : { 'visibility': 'hidden' };
  }
  // endregion

  // region method
  notChecked() {
    return false;
  }

  updateAnswerOption(questionId: string, answerOptionIndex: number, e: InputEvent) {
    if(!e.target) {
      return;
    }
    const eventTarget = e.target as HTMLInputElement;
    const answerOption = eventTarget.value;
    $surveyStore.fetchUpdateAnswerOption( { questionId, answerOptionIndex, answerOption });
  }
  //
  deleteAnswerOption(questionId: string, answerOptionIndex: number) {
    $surveyStore.fetchDeleteAnswerOption({ questionId, answerOptionIndex });
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
