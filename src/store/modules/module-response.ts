import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

export interface IResponse {
  userName: string;
  surveyName: string;
  questionAnswerList: IQuestionAnswer[];
}

export interface IQuestionAnswer {
  id : string;
  answerList: string[]
}


@Module({ namespaced: true, name: 'response' })
export default class ModuleResponse extends VuexModule {
  // 초기값
  responseList: IResponse[] = [];

}
