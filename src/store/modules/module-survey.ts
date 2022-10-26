import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { uniqueId } from 'lodash';
import { QUESTION_TYPES } from '@/const/index';

export interface ISurvey {
  surveyId?: string;
  surveyName: string;
  questionList: IQuestion[];
}

export interface IQuestion {
  questionId : string;
  questionName: string;
  answerType: number;
  answerOptionList: string[];
}

const initialSurvey: ISurvey = {
  surveyName: '',
  questionList: [
    { questionId: uniqueId(),
      questionName: '',
      answerType: QUESTION_TYPES.YES_NO,
      answerOptionList: ['답변 옵션 1', '답변 옵션 2'],
    },
  ],
};
const newQuestion = (newId: string) => ({
  questionId: newId,
  questionName: '',
  answerType: QUESTION_TYPES.YES_NO,
  answerOptionList: ['답변 옵션1', '답변 옵션2'],
});


@Module({ namespaced: true, name: 'survey' })
export default class ModuleSurvey extends VuexModule {
  surveyList: ISurvey[] = []
  survey: ISurvey = initialSurvey

  @Mutation
  private setInitialSurvey() {
    this.survey = initialSurvey;
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

  // 질문 삭제
  @Mutation
  private deleteQuestion(questionId: string) {
    this.survey.questionList = this.survey.questionList.filter(
      (item) => item.questionId !== questionId
    );
  }

  // 특정 질문의 질문내용 수정
  @Mutation
  private updateQuestionName({ questionId, questionName }: {questionId: string, questionName: string}) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    this.survey.questionList[foundIndex] = { ...this.survey.questionList[foundIndex], questionName };
  }

  // 특정 질문의 답변타입 수정
  @Mutation
  private updateAnswerType({ questionId, answerType }: {questionId: string, answerType: number}) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    this.survey.questionList[foundIndex].answerType = answerType;
  }

  // 특정 질문의 답변옵션 추가
  @Mutation
  private addAnswerOption({ questionId, newAnswerOption }: {questionId: string, newAnswerOption: string}) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    console.log(foundIndex);
    console.log(newAnswerOption);
    this.survey.questionList[foundIndex].answerOptionList.push(newAnswerOption);
  }


  // 특정 질문의 답변옵션 수정
  @Mutation
  private updateAnswerOption({ questionId, answerOptionIndex, answerOption }: {questionId: string,
    answerOptionIndex: number, answerOption: string}) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    this.survey.questionList[foundIndex].answerOptionList[answerOptionIndex] = answerOption;
  }

  // 특정 질문의 답변옵션 삭제
  @Mutation
  private deleteAnswerOption({ questionId, answerOptionIndex }: { questionId: string, answerOptionIndex: number }) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    this.survey.questionList[foundIndex].answerOptionList.splice(answerOptionIndex, 1);
  }

  // 설문 저장
  @Mutation
  private saveSurvey(survey: ISurvey) {
    // surveyId 부여는 임시
    // API 연동 이후 삭제 예정
    const surveyId = uniqueId();
    this.surveyList.push({ ...survey, surveyId });
  }
  // ---------------------------MUTATION END----------------------------



  // ---------------------------ACTION START----------------------------
  //설문 제목 수정
  @Action
  public fetchUpdateSurveyName(surveyName: string) {
    this.updateSurveyName(surveyName);
  }

  // 질문 추가
  @Action
  public fetchAddQuestion() {
    const newId = uniqueId();
    this.addQuestion(newQuestion(newId));
  }

  // 질문 삭제
  @Action
  public fetchDeleteQuestion(questionId: string) {
    this.deleteQuestion(questionId);
  }

  // 특정 질문 내용 수정
  @Action
  public fetchUpdateQuestionName({ questionId, questionName }: {questionId: string, questionName: string}) {
    this.updateQuestionName({ questionId, questionName });
  }

  // 특정 질문 답변 타입 수정
  @Action
  public fetchUpdateAnswerType({ questionId , answerType }: {questionId: string, answerType: number}) {
    this.updateAnswerType({ questionId, answerType });
  }

  // 특정 질문 답변 옵션 추가
  @Action
  public fetchAddAnswerOption(questionId: string) {
    const newAnswerOption = '답변 옵션';
    this.addAnswerOption({ questionId, newAnswerOption });
  }

  // 특정 질문 답변 옵션 수정
  @Action
  public fetchUpdateAnswerOption({ questionId, answerOptionIndex, answerOption }: {questionId: string,
    answerOptionIndex: number, answerOption: string}) {
    this.updateAnswerOption({ questionId, answerOptionIndex, answerOption });
  }

  // 특정 질문 답변 옵션 삭제
  @Action
  public fetchDeleteAnswerOption({ questionId, answerOptionIndex }: {questionId: string, answerOptionIndex: number}) {
    this.deleteAnswerOption({ questionId, answerOptionIndex });
  }

  // 설문 저장
  @Action
  public fetchSaveSurvey() {
    this.saveSurvey(this.survey);
    this.setInitialSurvey();
  }
}
