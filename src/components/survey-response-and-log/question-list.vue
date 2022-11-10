<template>
  <div class="question-list">
    <div class="question" v-for="({ questionId, questionName, answerType, answerOptionList }, index) in questionList"
         :key="questionId">
      <div class="question__title">질문{{index}}. {{questionName}}</div>
      <div class="question__description">{{questionDescription(answerType)}}</div>
      <div class="answer-option-list">
        <div class="answer-option__wrapper" v-for="(answerOption, index) in answerOptionList" :key="index">
          <div class="answer-option" v-if="isRadioButton(answerType)">
            <label :for="index">
              <input type="radio"
                     :disabled="isLog"
                     :checked="isCheckedAnswer(questionId, answerOption)"
                     :value="JSON.stringify(answerOption)"
                     @change="handleChangeAnswer(questionId, $event)"
                     :name="questionId"/>
            </label>
            <div class="answer-option__content">{{answerOption.text}}</div>
          </div>
          <div class="answer-option" v-else-if="isCheckbox">
            <label :for="index">
              <input type="checkbox"
                     :disabled="isLog"
                     :checked="isCheckedAnswer(questionId, answerOption)"
                     :value="JSON.stringify(answerOption)"
                     @change="handleChangeAnswer(questionId, $event)"
                     :name="questionId"/>
            </label>
            <div class="answer-option__content">{{answerOption.text}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { $responseStore, $surveyStore } from '@/store';
// import AnswerOptionList from '@/components/survey-response-and-log/answer-option-list.vue';
import { AnswerTypes } from '@/enum/answer-types';
import _ from 'lodash';
import { IAnswerOption, IQuestion } from '@/store/modules/module-survey';
import { PageRouteNames } from '@/enum/page-names';
import { IQuestionResponse } from '@/store/modules/module-response';

@Component({})
export default class QuestionList extends Vue {
  // region prop
  @Prop( { type: Boolean }) isLog?: boolean;
  // endregion

  // region computed
  get questionList() {
    return $surveyStore.survey.questionList;
  }

  get surveyId() {
    return this.$route.params.surveyId;
  }
  // endregion

  // region method
  questionDescription(answerType: number) {
    if (answerType === AnswerTypes.yesNo || answerType === AnswerTypes.oneChoice) {
      return '하나의 답변을 선택해주세요.';
    }
    else if (answerType === AnswerTypes.multipleChoice) {
      return '여러 개의 답변을 선택할 수 있습니다.';
    }
  }

  isRadioButton(answerType: number) {
    return answerType === AnswerTypes.yesNo || answerType === AnswerTypes.oneChoice;
  }

  isCheckbox(answerType: number) {
    return answerType === AnswerTypes.multipleChoice;
  }

  handleChangeAnswer(questionId: string, e: MouseEvent) {
    const selected = e.target as HTMLInputElement;
    $responseStore.fetchUpdateAnswer({ questionId, selectedAnswer: JSON.parse(selected.value) });
  }

  isCheckedAnswer(questionId: string, answerOption: IAnswerOption) {
    // 개별 로그 페이지일 때만 로직 진행
    if (this.$route.name === PageRouteNames.surveyLogDetail) {

      // 특정 question 에 대한 choiceAnswerList 가 answerOption 의 text 값을 가지고 있는지를 판별하는 로직
      // 1. questionResponseList 를 순회하며, questionResponse 와 같은 questionId 를 가지고 있는 값을 찾는다.
      const questionResponse = _.find($responseStore.logDetail.questionResponseList, { questionId }) as IQuestionResponse;

      // 2. 찾은 questionResponse 의 choiceAnswerList 에서 answerOption 의 text 와 같은 값이 있는지 판별하여 true, false
      return _.filter(questionResponse.choiceAnswerList, { text: answerOption.text }).length > 0;
    }
  }
  // endregion

}
</script>
