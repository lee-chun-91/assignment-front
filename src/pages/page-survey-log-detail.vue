<template>
  <DefaultLayout>
    <div class="breadcrumb">
      <router-link :to="{ path: '/' }">설문 목록</router-link>
      <span> > </span>
      <router-link :to="{ path: `/log/${surveyId}` }">{{survey.surveyName}} 로그</router-link>
      <span> > </span>
      <router-link :to="{ path: `/log/${surveyId}/${userName}` }">{{userName}}님의 응답</router-link>
    </div>
    <div class="survey-log-detail" v-if="fullscreenLoading" v-loading="fullscreenLoading"></div>
    <div class="survey-log-detail" v-else>
      <div class="survey-title">
        <h1 class="survey-title__surveyName">{{survey.surveyName}}</h1>
        <p class="survey-title__userName">{{log.userName + '님의 응답 결과'}}</p>
      </div>
      <div class="question-list">
        <div class="question" v-for="({ questionId, questionName, answerType, answerOptionList }, index) in questionList"
             :key="questionId">
          <div class="question__title">질문{{index}}. {{questionName}}</div>
          <div class="question__description">{{questionDescription(answerType)}}</div>
          <div class="answer-option-list" v-if="isRadioButton(answerType)">
            <div class="answer-option-wrapper" v-for="(answerOption) in answerOptionList" :key="answerOption.id">
              <div class="answer-option">
                <el-radio disabled
                          :label="answerOption.text"
                          :value="getOneChoiceAnswer(questionId)">
                  {{answerOption.text}}
                </el-radio>
              </div>
            </div>
          </div>
          <div class="answer-option-list" v-else>
            <div class="answer-option-wrapper" v-for="answerOption in answerOptionList" :key="answerOption.id">
              <div class="answer-option">
                <el-checkbox disabled
                             :checked="isMultipleChoiceAnswer(questionId, answerOption)">
                  {{answerOption.text}}
                </el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>



<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { $surveyStore } from '@/store';
import { responseApi } from '@/apis/reponseApi';
import { IQuestionResponse, IResponse } from '@/store/modules/module-response';
import _ from 'lodash';
import { AnswerTypes } from '@/enum/answer-types';
import { IAnswerOption } from '@/store/modules/module-survey';
import DefaultLayout from '@/layouts/default-layout.vue';

@Component({ components: { DefaultLayout } })
export default class PageSurveyLogDetail extends Vue {
  // region local
  fullscreenLoading = true
  log: IResponse = {
    userName: '',
    surveyId: '',
    questionResponseList: []
  };
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  get survey() {
    return $surveyStore.survey;
  }

  get userName() {
    return this.$route.params.userName;
  }

  get questionList() {
    return $surveyStore.survey.questionList;
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

  getOneChoiceAnswer(questionId: string) {
    const questionResponse = _.find(this.log.questionResponseList, (a) => a.questionId === questionId);
    if (questionResponse) {
      return questionResponse.oneChoiceAnswer.text;
    }
    return '';
  }

  isMultipleChoiceAnswer(questionId: string, answerOption: IAnswerOption) {
    const questionResponse = _.find(this.log.questionResponseList, { questionId }) as IQuestionResponse;
    return _.filter(questionResponse.multipleChoiceAnswerList, { id: answerOption.id }).length > 0;
  }
  // endregion

  // region lifecycle
  async created() {
    await responseApi.getLogDetail(this.surveyId, this.userName)
      .then((res) => {
        const questionResponseList: IQuestionResponse[] = _.map(res.data.question_response_list, (backQuestionResponse) => {
          return {
            questionId: backQuestionResponse.question_id,
            oneChoiceAnswer: backQuestionResponse.one_choice_answer,
            multipleChoiceAnswerList: backQuestionResponse.multiple_choice_answer_List,
          };
        });

        const log: IResponse = {
          userName: res.data.user_name,
          surveyId: res.data.survey_id,
          createdAt: res.data.created_at,
          questionResponseList,
        };

        this.log = log;
      });

    console.log(this.log);
    this.fullscreenLoading = false;
  }
  // endregion
}
</script>

