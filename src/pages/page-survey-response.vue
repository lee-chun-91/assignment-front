<template>
  <div class="survey-response">
    <div class="container" v-if="fullscreenLoading" v-loading="fullscreenLoading"></div>
    <div class="container" v-else>
      <div class="container--response__wrapper">
        <div class="survey-title">
          <h1 class="survey-title__surveyName">{{surveyName}}</h1>
          <p class="survey-title__userName">{{description}}</p>
        </div>
        <div class="question-list">
          <div class="question" v-for="({ questionId, questionName, answerType, answerOptionList }, questionIndex) in questionList"
                 :key="questionId">
              <div class="question__title">질문{{questionIndex}}. {{questionName}}</div>
              <div class="question__description">{{questionDescription(answerType)}}</div>
              <div class="answer-option-list" v-if="isRadioButton(answerType)">
                <div class="answer-option-wrapper" v-for="(answerOption) in answerOptionList" :key="answerOption.id">
                  <div class="answer-option">
                    <el-radio @change="changeOneChoiceAnswer(questionIndex, answerOption)"
                              :label="answerOption.text"
                              :value="getAnswer(questionId).oneChoiceAnswer.text">
                      {{answerOption.text}}
                    </el-radio>
                  </div>
                </div>
              </div>
              <div class="answer-option-list" v-else>
                <div class="answer-option-wrapper" v-for="(answerOption) in answerOptionList" :key="answerOption.id">
                  <div class="answer-option">
                    <el-checkbox @change="changeMultipleChoiceAnswerList(questionIndex, answerOption)">
                      {{answerOption.text}}
                    </el-checkbox>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <el-button class="container__button container__button--save" type="success" icon="el-icon-check" round @click="saveResponse">응답 제출하기</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { $surveyStore } from '@/store';
import { UTILS } from '@/utils/index';
import { NoticeMessages } from '@/enum/notice-messages';
import { PageRouteNames } from '@/enum/page-names';
import { AnswerTypes } from '@/enum/answer-types';
import { IAnswerOption } from '@/store/modules/module-survey';
import _ from 'lodash';
import { IBackResponse, IResponse } from '@/store/modules/module-response';
import { responseApi } from '@/apis/reponseApi';

Component.registerHooks([
  'beforeRouteEnter'
]);

@Component({ })
export default class PageSurveyResponse extends Vue {
  // region local
  fullscreenLoading = true
  userResponse: IResponse = {
    userName: this.userName,
    surveyId: this.surveyId,
    questionResponseList: []
  };
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  get userName() {
    return this.$route.params.userName;
  }

  get surveyName() {
    return $surveyStore.survey.surveyName;
  }

  get questionList() {
    return $surveyStore.survey.questionList;
  }

  get description() {
    return `${this.userName} 님, 설문에 응답해주세요.`;
  }
  // endregion

  // region method
  beforeRouteEnter(to, from, next) {
    console.log(to, from);
    next();
  }


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

  getAnswer(questionId: string) {
    return this.userResponse.questionResponseList.find((a) => a.questionId === questionId);
  }

  changeOneChoiceAnswer(questionIndex: number, selectedAnswerOption: IAnswerOption) {
    const oldState = this.userResponse.questionResponseList[questionIndex];
    Vue.set(this.userResponse.questionResponseList, questionIndex, { ...oldState, oneChoiceAnswer: selectedAnswerOption });
  }

  changeMultipleChoiceAnswerList (questionIndex: number, selectedAnswerOption: IAnswerOption) {

    const questionResponse = this.userResponse.questionResponseList[questionIndex];

    // choiceAnswerList 에 유저의 multipleChoiceAnswerList 에 있는지 여부 확인
    const indexOfChoiceAnswer = _.findIndex(questionResponse.multipleChoiceAnswerList,
      (choiceAnswer) => {return choiceAnswer.text === selectedAnswerOption.text ;});

    // 답변 타입이 multiple 인 경우 selectedAnswer 의 기저장 여부에 따라 처리
    // 유저가 체크한 selectedAnswer 가 저장되어 있으면 splice 로 삭제
    if(indexOfChoiceAnswer !== -1) {
      this.userResponse.questionResponseList[questionIndex].multipleChoiceAnswerList.splice(indexOfChoiceAnswer,1);
    }
    // 유저가 체크한 selectedAnswer 가 저장되어 있지 않으면 push 로 추가
    else if (indexOfChoiceAnswer === -1) {
      this.userResponse.questionResponseList[questionIndex].multipleChoiceAnswerList.push(selectedAnswerOption);
    }
  }

  async saveResponse() {
    // 질문 응답 여부 validation
    const hasUnchecked = _.filter(this.userResponse.questionResponseList, (questionResponse) => {
      return questionResponse.oneChoiceAnswer.id === '' && questionResponse.multipleChoiceAnswerList.length === 0;
    }).length > 0;

    if (hasUnchecked) {
      this.$message({
        showClose: true,
        message: NoticeMessages.failSaveResponse,
        type: 'error'
      });
      return;
    }

    const convertedDate = UTILS.convertDate(new Date());
    const question_response_list = _.map(this.userResponse.questionResponseList, (questionResponse) => {
      return {
        question_id: questionResponse.questionId,
        one_choice_answer: questionResponse.oneChoiceAnswer,
        multiple_choice_answer_List: questionResponse.multipleChoiceAnswerList,
      };
    });

    const backResponse: IBackResponse = {
      user_name: this.userResponse.userName,
      survey_id: this.userResponse.surveyId,
      created_at: convertedDate,
      question_response_list,
    };

    return await responseApi.saveResponse(backResponse)
      .then((res) =>
        this.$alert(NoticeMessages.successSaveResponse, '완료', {
          confirmButtonText: '다른 응답 제출',
          callback: () => {
            this.$router.push( { name: PageRouteNames.surveyResponseUserValidate, params: { surveyId: this.surveyId } });
          }
        })
      )
      .catch((error) => { return Promise.reject(error); });
  }
  // endregion


  // region lifecycle
  async created() {
    // params 가 변경된 것이지 라우팅이 변경된 게 아니기 때문에, $watch 로 변화를 비교할 수 있다.
    this.$watch(() => this.$route.params, (current, old) => {
      if (current.userName !== old.userName) {
        this.$router.push({ name: PageRouteNames.surveyResponseUserValidate });
      }
    });

    await $surveyStore.fetchGetSurvey(this.surveyId)
      .then(() => {
        this.userResponse.questionResponseList = _.map($surveyStore.survey.questionList, (question)=> {
          return {
            questionId: question.questionId,
            oneChoiceAnswer: { id: '', text: '' },
            multipleChoiceAnswerList: [],
          };
        });
        this.fullscreenLoading = false;
      });
  }
}
</script>
