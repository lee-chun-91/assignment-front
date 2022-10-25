import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { uniqueId } from 'lodash';
import { QUESTION_TYPES } from '@/const/index';

export interface ISurvey {
  surveyName: string;
  questionList: IQuestion[];
}

export interface IQuestion {
  id : string;
  questionName: string;
  answerType: number;
  answerOptionList: string[];
}

@Module({ namespaced: true, name: 'survey' })
export default class ModuleSurvey extends VuexModule {
  surveyList: ISurvey[] = []
  survey: ISurvey = {
    surveyName: '',
    questionList: [
      { id: uniqueId(),
        questionName: '질문 1번입니다',
        answerType: QUESTION_TYPES.YES_NO,
        answerOptionList: ['답변 선택1', '답변 선택2'],
      },
      { id: uniqueId(),
        questionName: '질문 2번입니다',
        answerType: QUESTION_TYPES.MULTIPLE_CHOICE,
        answerOptionList: ['답변 선택1', '답변 선택2', '답변 선택 3'],
      }
    ],
  }

  // 설문제목 수정
  @Mutation
  private updateSurveyName(surveyName: string) {
    this.survey.surveyName = surveyName;
  }


  // 질문 추가
  @Mutation
  private addQuestion(question: IQuestion) {
    this.survey.questionList.push(question);
  }

  // 질문 수정
  @Mutation
  private updateQuestion(question: IQuestion) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.id === question.id);
    this.survey.questionList[foundIndex] = question;
  }

  // 질문 삭제
  @Mutation
  private deleteQuestion(deleteId: string) {
    this.survey.questionList = this.survey.questionList.filter(
      (item) => item.id !== deleteId
    );
  }


  // 특정 질문의 질문명 수정
  @Mutation
  private updateQuestionName(questionId: string, questionName: string) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.id === questionId);
    this.survey.questionList[foundIndex] = { ...this.survey.questionList[foundIndex], questionName };
  }

  // 특정 질문의 답변타입 수정
  @Mutation
  private updateAnswerType(questionId: string, answerType: number) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.id === questionId);
    this.survey.questionList[foundIndex] = { ...this.survey.questionList[foundIndex], answerType };
  }

  // 특정 질문의 답변옵션 추가
  @Mutation
  private addAnswerOption(questionId: string, answerOption: string) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.id === questionId);
    this.survey.questionList[foundIndex].answerOptionList.push(answerOption);
  }


  // 특정 질문의 답변옵션 수정
  @Mutation
  private updateAnswerOption(questionId: string) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.id === questionId);
  }

  // 특정 질문의 답변옵션 삭제
  @Mutation
  private deleteAnswerOption(deleteId: string) {
    this.survey.questionList = this.survey.questionList.filter(
      (item) => item.id !== deleteId
    );
  }

  @Mutation
  private saveSurvey(survey: ISurvey) {
    this.surveyList.push(survey);
  }

  @Action
  public fetchUpdateSurveyName(surveyName: string) {
    this.updateSurveyName(surveyName);
  }


}
