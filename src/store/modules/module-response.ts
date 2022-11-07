import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { responseApi } from '@/apis/reponseApi';
import { $surveyStore } from '@/store';
import { QuestionTypes } from '@/enum/question-types';
import { deleteCookie, setCookie } from '@/utils/cookie';
import { NoticeMessage } from '@/enum/notice-message';


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
  questionAnswer: IQuestionAnswer[];
}

export interface IBackResponse {
  user_name: string;
  survey_id: string,
  created_at: string;
  question_answer: IBackQuestionAnswer[];
}

export interface IQuestionAnswer {
  questionId : string;
  answer: string[];
}

export interface IBackQuestionAnswer {
  question_id : string;
  answer: string[];
}

const initialResponse: IResponse = {
  userName: '',
  surveyId: '',
  questionAnswer: [],
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
  private setInitialResponse() {
    const initialResponse: IResponse = {
      userName: '',
      surveyId: '',
      questionAnswer: [],
    };

    this.response = initialResponse;
  }

  @Mutation
  private setResponse({ userName, surveyId }: Omit<IResponse, 'questionAnswer'>) {
    this.response.userName = userName;
    this.response.surveyId = surveyId;
  }

  @Mutation
  private updateQuestionAnswer(data: {questionId: string, selectedAnswer: string}) {
    // 1.해당 질문을 설문지 state 에서 찾기
    const questionIndexInSurvey = $surveyStore.survey.questionList.findIndex((q) => q.questionId === data.questionId);

    // 2. 해당 질문에 대한 answer type 확인
    const answerType = $surveyStore.survey.questionList[questionIndexInSurvey].answerType;

    // 3. response questionAnswer 에 해당 질문에 대한 답변 있는지 찾기
    const questionAnswerIndex = this.response.questionAnswer.findIndex((i) => i.questionId === data.questionId);

    //4.1. 답변이 이미 저장되어 있고 답변타입이 단일이면, response 에 저장되어 있는 questionAnswer 값을 바꾼다
    if (questionAnswerIndex >= 0) {
      // selectedAnswer 가 answer 배열에 저장되어 있는지 체크
      const answerIndex = this.response.questionAnswer[questionAnswerIndex]['answer'].findIndex((a) => a === data.selectedAnswer);

      if (answerType === QuestionTypes.yesNo || answerType === QuestionTypes.oneChoice) {
        this.response.questionAnswer[questionAnswerIndex] = { questionId: data.questionId, answer: [data.selectedAnswer] };
      }
      // 4.2.1. 답변 타입이 multiple, questionAnswer 의 answer 배열에 checkedAnswer 값이 저장되어 있으면 그 값을 뺀다
      else if (answerType === QuestionTypes.multipleChoice) {
        if (answerIndex >= 0) {
          this.response.questionAnswer[questionAnswerIndex]['answer'].splice(answerIndex, 1);
        }
        // 4.2.2. 답변 타입이 multiple, questionAnswer 의 answer 배열에 checkedAnswer 값이 없으면 그 값을 넣는다.
        else if (answerIndex === -1) {
          this.response.questionAnswer[questionAnswerIndex]['answer'].push(data.selectedAnswer);
        }
      }
    }
    // 4.2. 답변이 저장되어 있지 않았다면, response questionAnswer 에 data 를 넣는다.
    else if (questionAnswerIndex === -1) {
      this.response.questionAnswer.push({ questionId: data.questionId, answer: [data.selectedAnswer] });
    }
  }


  @Mutation
  private getLogList(backLogList: IBackLogList) {
    const data: IResponse[] = backLogList.data.map((responsse) => {
      const questionAnswer: IQuestionAnswer[] = responsse.question_answer.map((i) => {
        return {
          questionId: i.question_id,
          answer: i.answer,
        };});
      return {
        userName: responsse.user_name,
        surveyId: responsse.survey_id,
        createdAt: responsse.created_at,
        questionAnswer
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
    const questionAnswer: IQuestionAnswer[] = data.question_answer.map((i) => {
      return {
        questionId: i.question_id,
        answer: i.answer,
      };
    });

    const logDetail: IResponse = {
      userName: data.user_name,
      surveyId: data.survey_id,
      createdAt: data.created_at,
      questionAnswer,
    };

    this.logDetail = logDetail;
  }

  // ---------------------------MUTATION END----------------------------

  // ---------------------------ACTION START----------------------------
  @Action({ rawError: true })
  public async fetchUserCheck({ userName, surveyId }: Pick<IResponse, 'userName'|'surveyId'>) {
    if (userName === '') {
      return Promise.reject(NoticeMessage.emptyUserName);
    }

    const params: Pick<IBackResponse, 'user_name'|'survey_id'> = {
      user_name: userName,
      survey_id: surveyId,
    };
    return await responseApi.responseUserCheck(params)
      .then((res) => {
        const result: string = res.data.result;
        if (result === 'new_user') {
          this.setResponse({ userName, surveyId });
        }

        // user 응답 여부 결과 return
        return result;
      })
      .catch((res) => console.log('userCheck catch', res));
  }

  @Action
  public fetchSetResponseItem({ userName, surveyId }: Pick<IResponse, 'userName'|'surveyId'>) {
    this.setResponse({ userName, surveyId });
  }

  // 응답 update
  @Action
  public fetchUpdateQuestionAnswer(data: { questionId:string, selectedAnswer:string }) {
    this.updateQuestionAnswer(data);
  }

  // 응답 저장
  @Action({ rawError: true })
  public async fetchSaveResponse(convertedDate: string) {
    // 질문 응답 여부 validation
    const isUncheckedAnswer = this.response.questionAnswer.length !== $surveyStore.survey.questionList.length;

    if (isUncheckedAnswer) {
      return Promise.reject(NoticeMessage.failSaveResponse);
    }

    const question_answer = this.response.questionAnswer.map((i) => { return {
      question_id: i.questionId,
      answer: i.answer,
    };});

    const backResponse: IBackResponse = {
      user_name: this.response.userName,
      survey_id: this.response.surveyId,
      created_at: convertedDate,
      question_answer,
    };

    return await responseApi.saveResponse(backResponse)
      .then((res) => {
        // initial state
        this.setInitialResponse();
      })
      .catch((error) => console.log(error));
  }


  @Action
  public async fetchGetLogListAll(surveyId: string) {
    await responseApi.getLogListAll(surveyId)
      .then((res) => {
        this.getLogList(res.data);
      })
      .catch((error) => console.log(error));
  }


  // logLIst get
  @Action
  public async fetchGetLogList({ page, surveyId }: {page: number, surveyId: string}){
    await responseApi.getLogList(page, surveyId)
      .then((res) => {
        this.getLogList(res.data);
      })
      .catch((error) => console.log(error));
  }

  // logDetail get
  @Action
  public async fetchGetLogDetail({ surveyId, userName }: {surveyId: string, userName: string}){
    await responseApi.getLogDetail(surveyId, userName)
      .then((res) => {
        this.getLogDetail(res.data);
      })
      .catch((error) => console.log(error));
  }

}
