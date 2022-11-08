<template>
  <div class="answer-option-list">
    <div class="answer-option__wrapper" v-for="(answerOption, index) in answerOptionList" :key="index">
      <div class="answer-option" v-if="isRadioButton">
        <label :for="index">
          <input type="radio" :disabled="isLog" :checked="isCheckedAnswer(answerOption)" :value="JSON.stringify(answerOption)" @change="handleChangeAnswer($event)" :name="questionId"/>
        </label>
        <div class="answer-option__content">{{answerOption.text}}</div>
      </div>
      <div class="answer-option" v-else-if="isCheckbox">
        <label :for="index">
          <input type="checkbox" :disabled="isLog" :checked="isCheckedAnswer(answerOption)" :value="JSON.stringify(answerOption)" @change="handleChangeAnswer($event)" :name="questionId"/>
        </label>
        <div class="answer-option__content">{{answerOption.text}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AnswerTypes } from '@/enum/answer-types';
import { $responseStore, $surveyStore } from '@/store';
import { PageRouteNames } from '@/enum/page-names';
import { IAnswerOption } from '@/store/modules/module-survey';

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
    return this.answerType === AnswerTypes.yesNo || this.answerType === AnswerTypes.oneChoice;
  }

  get isCheckbox() {
    return this.answerType === AnswerTypes.multipleChoice;
  }
  // endregion

  // region method
  handleChangeAnswer(e: MouseEvent) {
    const selected = e.target as HTMLInputElement;
    console.log('selectedAnswer', selected.value);

    $responseStore.fetchUpdateAnswer({ questionId: this.questionId, selectedAnswer: JSON.parse(selected.value) });
    console.log('response', $responseStore.response);
  }

  isCheckedAnswer(answerOption: IAnswerOption) {
    // 개별 로그 페이지일 때만 로직 진행
    if (this.$route.name === PageRouteNames.surveyLogDetail) {
      // 1. 질문 id 값 같은 아이템 찾기
      const foundIndex = $responseStore.logDetail.answerList.findIndex((i) => i.questionId === this.questionId);
      // 2.1. 질문 id 값 같은 아이템이 없다면(유저가 해당 질문에 대해 응답한 적이 없다면) false return
      if (foundIndex === -1) return false;
      // 2.2. 질문 id 값 같은 아이템 있다면, 그 질문에 대한 응답 Array 에 answerOption 이 포함되어 있는지 체크하여 return
      else {
        const answer = $responseStore.logDetail.answerList[foundIndex].answer;
        return answer.filter((answerItem) => answerItem.text === answerOption.text).length > 0;
      }
    }
  }
  // endregion
}
</script>
