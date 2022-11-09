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
import { IAnswerOption, IQuestion } from '@/store/modules/module-survey';
import { IQuestionResponse } from '@/store/modules/module-response';
import _ from 'lodash';

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
    const question = _.find($surveyStore.survey.questionList, { questionId: this.questionId }) as IQuestion;
    return question.answerType;
  }

  get answerOptionList() {
    const question = _.find($surveyStore.survey.questionList, { questionId: this.questionId }) as IQuestion;
    return question.answerOptionList;
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
    $responseStore.fetchUpdateAnswer({ questionId: this.questionId, selectedAnswer: JSON.parse(selected.value) });
    console.log($responseStore.response);
  }

  isCheckedAnswer(answerOption: IAnswerOption) {
    // 개별 로그 페이지일 때만 로직 진행
    if (this.$route.name === PageRouteNames.surveyLogDetail) {

      // 특정 question 에 대한 choiceAnswerList 가 answerOption 의 text 값을 가지고 있는지를 판별하는 로직
      // 1. questionResponseList 를 순회하며, questionResponse 와 같은 questionId 를 가지고 있는 값을 찾는다.
      const questionResponse = _.find($responseStore.logDetail.questionResponseList,
        { questionId: this.questionId }) as IQuestionResponse;

      // 2. 찾은 questionResponse 의 choiceAnswerList 에서 answerOption 의 text 와 같은 값이 있는지 판별하여 true, false
      return _.filter(questionResponse.choiceAnswerList, { text: answerOption.text }).length > 0;
    }
  }
  // endregion
}
</script>
