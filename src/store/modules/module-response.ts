import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { responseApi } from '@/apis/reponseApi';

export interface IResponse {
  userName: string;
  surveyId: string;
  questionAnswer: IQuestionAnswer[];
}

export interface IBackResponse {
  user_name: string;
  survey_id: string,
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

  // @Mutation
  private updateQuestionAnswer(data: {questionId: string, answer: string}) {
    null;
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
  @Action fetchUpdateQuestionAnswer(data: { questionId:string, answer:string }) {
    this.updateQuestionAnswer(data);
  }

}
