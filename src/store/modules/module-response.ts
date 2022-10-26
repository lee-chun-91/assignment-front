import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

export interface IResponse {
  user_name: string;
  survey_id: string;
  question_answer: IQuestionAnswer[];
}

export interface IQuestionAnswer {
  question_id : string;
  answer: string[];
}

const initialResponse: IResponse = {
  user_name: '',
  survey_id: '',
  question_answer: [],
};


@Module({ namespaced: true, name: 'response' })
export default class ModuleResponse extends VuexModule {
  // 초기값
  responseList: IResponse[] = [];
  response: IResponse = initialResponse;


  // ---------------------------MUTATION START----------------------------

  @Mutation
  private setResponseItem({ userName, surveyId }: {userName: string, surveyId: string}) {
    this.response.user_name = userName;
    this.response.survey_id = surveyId;
  }

  // @Mutation
  private addQuestionAnswer(data: IQuestionAnswer) {
    this.response.question_answer.push(data);
  }

  // ---------------------------MUTATION END----------------------------

  // ---------------------------ACTION START----------------------------
  @Action
  public fetchSecResponseItem({ userName, surveyId }: {userName: string, surveyId: string}) {
    this.setResponseItem({ userName, surveyId });
  }

  @Action fetchAddQuestionAnswer(data: IQuestionAnswer) {
    this.addQuestionAnswer(data);
  }

}
