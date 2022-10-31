import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { responseApi } from '@/apis/reponseApi';
import { $surveyStore } from '@/store';
import { QUESTION_TYPES } from '@/const/index';

export interface IResponse {
  userName: string;
  surveyId: string;
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
  responseList: IResponse[] = [];
  response: IResponse = initialResponse;


  // ---------------------------MUTATION START----------------------------

  @Mutation
  private setResponse({ userName, surveyId }: Omit<IResponse, 'questionAnswer'>) {
    this.response.userName = userName;
    this.response.surveyId = surveyId;
  }

  @Mutation
  private updateQuestionAnswer(data: {questionId: string, selectedAnswer: string}) {
    // 1.해당 질문을 설문지 state 에서 찾기
    const questionIndexInSurvey = $surveyStore.survey.questionList.findIndex((q) => q.questionId === data.questionId);

    console.log('questionIndexInSurvey', questionIndexInSurvey);

    // 2. 해당 질문에 대한 answer type 확인
    const answerType = $surveyStore.survey.questionList[questionIndexInSurvey].answerType;
    console.log('answerType', answerType);

    // 3. response questionAnswer 에 해당 질문에 대한 답변 있는지 찾기
    const questionAnswerIndex = this.response.questionAnswer.findIndex((i) => i.questionId === data.questionId);
    console.log('questionAnswerIndex', questionAnswerIndex);

    //4.1. 답변이 이미 저장되어 있고 답변타입이 단일이면, response 에 저장되어 있는 questionAnswer 값을 바꾼다
    if (questionAnswerIndex >= 0) {
      // selectedAnswer 가 answer 배열에 저장되어 있는지 체크
      const answerIndex = this.response.questionAnswer[questionAnswerIndex]['answer'].findIndex((a) => a === data.selectedAnswer);
      console.log('answerIndex', answerIndex);

      if (answerType === QUESTION_TYPES.YES_NO || answerType === QUESTION_TYPES.ONE_CHOICE) {
        console.log('one 재할당');
        this.response.questionAnswer[questionAnswerIndex] = { questionId: data.questionId, answer: [data.selectedAnswer] };
      }
      // 4.2.1. 답변 타입이 multiple, questionAnswer 의 answer 배열에 checkedAnswer 값이 저장되어 있으면 그 값을 뺀다
      else if (answerType === QUESTION_TYPES.MULTIPLE_CHOICE) {
        if (answerIndex >= 0) {
          console.log('multiple splice');
          this.response.questionAnswer[questionAnswerIndex]['answer'].splice(answerIndex, 1);
        }
        // 4.2.2. 답변 타입이 multiple, questionAnswer 의 answer 배열에 checkedAnswer 값이 없으면 그 값을 넣는다.
        else if (answerIndex === -1) {
          console.log('multiple push!');
          this.response.questionAnswer[questionAnswerIndex]['answer'].push(data.selectedAnswer);
        }
      }
    }
    // 4.2. 답변이 저장되어 있지 않았다면, response questionAnswer 에 data 를 넣는다.
    else if (questionAnswerIndex === -1) {
      console.log('one push');
      this.response.questionAnswer.push({ questionId: data.questionId, answer: [data.selectedAnswer] });
    }
  }

  // ---------------------------MUTATION END----------------------------

  // ---------------------------ACTION START----------------------------


  //
  @Action
  public async fetchUserCheck({ userName, surveyId }: Pick<IResponse, 'userName'|'surveyId'>) {
    const params: Pick<IBackResponse, 'user_name'|'survey_id'> = {
      user_name: userName,
      survey_id: surveyId,
    };
    return await responseApi.responseUserChecK(params)
      .then((res) => {
        const result: string = res.data.result;
        if (result === 'new_user') {
          this.setResponse({ userName, surveyId });
        }
        return result;
      })
      .catch((res) => console.log('userCheck catch', res));
  }
  //
  @Action
  public fetchSetResponseItem({ userName, surveyId }: Pick<IResponse, 'userName'|'surveyId'>) {
    this.setResponse({ userName, surveyId });
  }

  // 질문에 대한 답변 update
  @Action
  public fetchUpdateQuestionAnswer(data: { questionId:string, selectedAnswer:string }) {
    this.updateQuestionAnswer(data);
  }

  @Action
  public async fetchSaveResponse(convertedDate: string) {
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
      .then((res) => console.log(res))
      .catch((error) => console.log(error));


  }
}
