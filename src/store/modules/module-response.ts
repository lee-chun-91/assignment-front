import { VuexModule, Module ,Mutation, Action } from 'vuex-module-decorators';
import { responseApi } from '@/apis/reponseApi';
import { IAnswerOption } from '@/store/modules/module-survey';
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
  oneChoiceAnswer: IAnswerOption;
  multipleChoiceAnswerList: IAnswerOption[]

}

export interface IBackQuestionResponse {
  question_id : string;
  answerType?: number;
  one_choice_answer: IAnswerOption,
  multiple_choice_answer_List: IAnswerOption[];
}

@Module({ namespaced: true, name: 'response' })
export default class ModuleResponse extends VuexModule {
  // state
  logList: ILogList = {
    total: 0,
    perPage: 0,
    data: []
  };


  // ---------------------------MUTATION START----------------------------

  @Mutation
  private getLogList(backLogList: IBackLogList) {
    const data: IResponse[] = _.map(backLogList.data, (backResponse) => {
      const questionResponseList: IQuestionResponse[] = _.map(backResponse.question_response_list,
        (backQuestionResponse) => {
          return {
            questionId: backQuestionResponse.question_id,
            oneChoiceAnswer: backQuestionResponse.one_choice_answer,
            multipleChoiceAnswerList: backQuestionResponse.multiple_choice_answer_List,
          };
        }
      );

      return {
        userName: backResponse.user_name,
        surveyId: backResponse.survey_id,
        createdAt: backResponse.created_at,
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
}
