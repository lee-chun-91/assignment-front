import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { uniqueId } from 'lodash';

export interface Iresponse {
  // response 스키마 타입 세팅 필요
  surveyName: string;
  questionList: [];
}


@Module({ namespaced: true, name: 'response' })
export default class ModuleResponse extends VuexModule {
  // 초기값
}
