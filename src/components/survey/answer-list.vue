<template>
  <div class="answer-list">
    <div v-for="(item, index) in answerOptionList" :key="index">
      <div v-if="isRadioButton">
        <label :for="index">
          <input type="radio" :id="index" :value="item" name="answer" />
          <input type="text" name="answerOption" :value="item" @input="updateAnswerOption(questionId, index, $event)" />
          <el-button square size="mini" @click="deleteAnswerOption(questionId, index)">삭제</el-button>
        </label>
      </div>
      <div v-else-if="isCheckbox">
        <label :for="index">
          <input type="checkbox" :id="index" :value="item" name="answer" />
          <input type="text" name="answerOption" :value="item" @input="updateAnswerOption(questionId, index, $event)" />
          <el-button square size="mini" @click="deleteAnswerOption(questionId, index)">삭제</el-button>
        </label>
      </div>
    </div>
    <el-button square size="mini" @click="addAnswerOption">+ 답변 옵션 추가</el-button>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import { QUESTION_TYPES } from '@/const/index';
import { $surveyStore } from '@/store';

@Component({})
export default class AnswerList extends Vue {
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

  // get isParticipation() {
  //   return String(this.$route.params) === '/survey/:surveyId';
  // }
  //
  // get isLog() {
  //   return String(this.$route.params) === 'log/:surveyId/:respondentName';
  // }

  // set isChecked() {
  //   if (this.isParticipation || this.isLog)
  // }

  // endregion

  // region method
  addAnswerOption() {
    $surveyStore.fetchAddAnswerOption(this.questionId);
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
