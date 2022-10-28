import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

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
  private addQuestionAnswer(data: IQuestionAnswer) {
    this.response.questionAnswer.push(data);
  }

  // ---------------------------MUTATION END----------------------------

  // ---------------------------ACTION START----------------------------
  @Action
  public fetchSecResponseItem({ userName, surveyId }: Omit<IResponse, 'questionAnswer'>) {
    this.setResponse({ userName, surveyId });
  }

  @Action fetchAddQuestionAnswer(data: IQuestionAnswer) {
    this.addQuestionAnswer(data);
  }

}
