import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { responseApi } from '@/apis/reponseApi';
import { $surveyStore } from '@/store';
import { AnswerTypes } from '@/enum/answer-types';
import { NoticeMessages } from '@/enum/notice-messages';
import { AxiosResponse } from 'axios';
import { IAnswerOption, IQuestion } from '@/store/modules/module-survey';
import _ from 'lodash';

export interface ILogList {
  total: number;
  perPage: number;
  data: IResponse[];
}

export interface IBackLogList {
  total: number;
  per_page: number;
  data: IBackResponse[];
}

export interface IResponse {
  userName: string;
  surveyId: string;
  createdAt?: string;
  questionResponseList: IQuestionResponse[];
}

export interface IBackResponse {
  user_name: string;
  survey_id: string,
  created_at: string;
  question_response_list: IBackQuestionResponse[];
}

export interface IQuestionResponse {
  questionId : string;
  choiceAnswerList: IAnswerOption[];
}

export interface IBackQuestionResponse {
  question_id : string;
  choice_answer_list: IAnswerOption[];
}

const initialResponse: IResponse = {
  userName: '',
  surveyId: '',
  questionResponseList: [
    {
      questionId: '',
      choiceAnswerList: [
        {
          id: '',
          text: '',
        }
      ],
    }
  ],
};


@Module({ namespaced: true, name: 'response' })
export default class ModuleResponse extends VuexModule {
  // 초기값
  logList: ILogList = {
    total: 0,
    perPage: 0,
    data: []
  };
  logDetail: IResponse = initialResponse;
  response: IResponse = initialResponse;


  // ---------------------------MUTATION START----------------------------

  @Mutation
  private initResponseState() {
    const initialResponse: IResponse = {
      userName: '',
      surveyId: '',
      questionResponseList: [
        {
          questionId: '',
          choiceAnswerList: [
            {
              id: '',
              text: '',
            }
          ],
        }
      ],
    };

    this.response = initialResponse;
  }

  @Mutation
  private setResponseUserNameAndSurveyId({ userName, surveyId }: Omit<IResponse, 'questionResponseList'>) {
    this.response.userName = userName;
    this.response.surveyId = surveyId;
  }

  @Mutation
  private updateAnswer(data: {questionId: string, selectedAnswer: IAnswerOption}) {
    // 1.해당 질문을 survey State 에서 찾고, 해당 질문에 대한 answer type 확인
    const question = _.find($surveyStore.survey.questionList, { 'questionId': data.questionId }) as IQuestion;
    const answerType = question.answerType;

    // 2. questionResponseList 에 해당 question 에 대한 response 가 저장되어 있는지 찾기
    const indexOfQuestionResponse =  _.findIndex(this.response.questionResponseList,
      (questionLResponse) => { return questionLResponse.questionId === data.questionId; });


    // 3.1. questionResponse 가 저장되어 있는 경우
    if(indexOfQuestionResponse !== -1) {

      // choiceAnswerList 에 유저가 체크한 selectedAnswer 가 있는지 여부 확인, findIndex 로 index 찾아냄
      const indexOfSelectedAnswer = _.findIndex(this.response.questionResponseList[indexOfQuestionResponse].choiceAnswerList,
        (choiceAnswer) => {return choiceAnswer.text === data.selectedAnswer.text ;});

      // 3.1.1. 답변타입이 yesno, 단일인 경우 questionResponse 값을 새로 할당
      if(answerType === AnswerTypes.yesNo || answerType === AnswerTypes.oneChoice) {
        this.response.questionResponseList[indexOfQuestionResponse] = { questionId: data.questionId, choiceAnswerList: [data.selectedAnswer] };
      }
      // 3.1.2. 답변 타입이 multiple 인 경우 selectedAnswer 의 기저장 여부에 따라 처리
      else if (answerType === AnswerTypes.multipleChoice) {
        // 3.1.2.1. 유저가 체크한 selectedAnswer 가 저장되어 있으면 splice 로 삭제
        if(indexOfSelectedAnswer !== -1) {
          this.response.questionResponseList[indexOfQuestionResponse].choiceAnswerList.splice(indexOfSelectedAnswer,1);
        }
        // 3.1.2.2. 유저가 체크한 selectedAnswer 가 저장되어 있지 않으면 push 로 추가
        else if (indexOfSelectedAnswer === -1) {
          this.response.questionResponseList[indexOfQuestionResponse].choiceAnswerList.push(data.selectedAnswer);
        }
      }
    }
    // 3.2. questionResponse 가 저장되어 있지 않은 경우
    else {
      this.response.questionResponseList.push({ questionId: data.questionId, choiceAnswerList: [data.selectedAnswer] });
    }
  }


  @Mutation
  private getLogList(backLogList: IBackLogList) {

    const data: IResponse[] = backLogList.data.map((response) => {
      const questionResponseList: IQuestionResponse[] = response.question_response_list.map((i) => {
        return {
          questionId: i.question_id,
          choiceAnswerList: i.choice_answer_list,
        };});
      return {
        userName: response.user_name,
        surveyId: response.survey_id,
        createdAt: response.created_at,
        questionResponseList
      };
    });

    const logList: ILogList = {
      total: backLogList.total,
      perPage: backLogList.per_page,
      data,
    };

    this.logList = logList;
  }

  @Mutation
  private getLogDetail(data: IBackResponse) {
    const questionResponseList: IQuestionResponse[] = data.question_response_list.map((i) => {
      return {
        questionId: i.question_id,
        choiceAnswerList: i.choice_answer_list,
      };
    });

    const logDetail: IResponse = {
      userName: data.user_name,
      surveyId: data.survey_id,
      createdAt: data.created_at,
      questionResponseList,
    };

    this.logDetail = logDetail;
  }

  // ---------------------------MUTATION END----------------------------

  // ---------------------------ACTION START----------------------------

  @Action({ rawError: true })
  public async fetchUserCheck({ userName, surveyId }: Pick<IResponse, 'userName'|'surveyId'>) {
    const params: Pick<IBackResponse, 'user_name'|'survey_id'> = {
      user_name: userName,
      survey_id: surveyId,
    };
    return await responseApi.responseUserCheck(params)
      .then((result) => Promise.resolve(result))
      .catch((error) => Promise.reject(error));
  }

  @Action
  public fetchSetResponseUserNameAndSurveyId({ userName, surveyId }: Pick<IResponse, 'userName'|'surveyId'>) {
    this.setResponseUserNameAndSurveyId({ userName, surveyId });
  }

  // 응답 update
  @Action({ rawError: true })
  public fetchUpdateAnswer(data: { questionId:string, selectedAnswer:IAnswerOption }) {
    this.updateAnswer(data);
  }

  // 유저 설문 응답 저장
  @Action({ rawError: true })
  public async fetchSaveResponse(convertedDate: string) {
    const question_response_list = this.response.questionResponseList.map((i) => { return {
      question_id: i.questionId,
      choice_answer_list: i.choiceAnswerList,
    };});

    const backResponse: IBackResponse = {
      user_name: this.response.userName,
      survey_id: this.response.surveyId,
      created_at: convertedDate,
      question_response_list,
    };

    return await responseApi.saveResponse(backResponse)
      .then((result) => { return Promise.resolve(result); })
      .catch((error) => { return Promise.reject(error); });
  }

  @Action
  public async fetchInitResponseState() { this.initResponseState(); }

  @Action
  public async fetchGetLogListAll(surveyId: string) {
    await responseApi.getLogListAll(surveyId)
      .then((res) => { this.getLogList(res.data); })
      .catch((error) => { return Promise.reject(error); });
  }


  // logLIst get
  @Action
  public async fetchGetLogList({ page, surveyId }: {page: number, surveyId: string}){
    await responseApi.getLogList(page, surveyId)
      .then((res) => { this.getLogList(res.data); })
      .catch((error) => { return Promise.reject(error); });
  }

  // logDetail get
  @Action
  public async fetchGetLogDetail({ surveyId, userName }: {surveyId: string, userName: string}){
    await responseApi.getLogDetail(surveyId, userName)
      .then((res) => { this.getLogDetail(res.data); })
      .catch((error) => { return Promise.reject(error); });
  }
}
