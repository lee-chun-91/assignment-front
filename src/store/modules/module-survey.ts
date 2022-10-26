import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { uniqueId } from 'lodash';
import { QUESTION_TYPES } from '@/const/index';

export interface ISurvey {
  survey_id?: string;
  survey_name: string;
  question_list: IQuestion[];
}

export interface IQuestion {
  question_id : string;
  question_name: string;
  answer_type: number;
  answer_option_list: string[];
}

const newQuestion = (newId: string) => ({
  question_id: newId,
  question_name: '',
  answer_type: QUESTION_TYPES.YES_NO,
  answer_option_list: ['답변 옵션 1', '답변 옵션 2'],
});


@Module({ namespaced: true, name: 'survey' })
export default class ModuleSurvey extends VuexModule {
  surveyList: ISurvey[] = []
  survey: ISurvey = {
    survey_name: '',
    question_list: [
      { question_id: uniqueId(),
        question_name: '',
        answer_type: QUESTION_TYPES.YES_NO,
        answer_option_list: ['답변 옵션 1', '답변 옵션 2'],
      },
    ],
  };

  // ---------------------------MUTATION START----------------------------
  @Mutation
  private setInitialSurvey() {
    console.log('setInitialSurvey!');
    const initialSurvey: ISurvey = {
      survey_name: '',
      question_list: [
        { question_id: uniqueId(),
          question_name: '',
          answer_type: QUESTION_TYPES.YES_NO,
          answer_option_list: ['답변 옵션 1', '답변 옵션 2'],
        },
      ],
    };
    this.survey = initialSurvey;
  }

  // 설문제목 수정
  @Mutation
  private updateSurveyName(surveyName: string) {
    this.survey.survey_name = surveyName;
  }

  // 질문 추가
  @Mutation
  private addQuestion(question: IQuestion) {
    this.survey.question_list.push(question);
  }

  // 질문 삭제
  @Mutation
  private deleteQuestion(question_id: string) {
    this.survey.question_list = this.survey.question_list.filter(
      (item) => item.question_id !== question_id
    );
  }

  // 특정 질문의 질문내용 수정
  @Mutation
  private updateQuestionName({ question_id, question_name }: {question_id: string, question_name: string}) {
    const foundIndex = this.survey.question_list.findIndex((i) => i.question_id === question_id);
    this.survey.question_list[foundIndex] = { ...this.survey.question_list[foundIndex], question_name };
  }

  // 특정 질문의 답변타입 수정
  @Mutation
  private updateAnswerType({ question_id, answer_type }: {question_id: string, answer_type: number}) {
    const foundIndex = this.survey.question_list.findIndex((i) => i.question_id === question_id);
    this.survey.question_list[foundIndex].answer_type = answer_type;
  }

  // 특정 질문의 답변옵션 추가
  @Mutation
  private addAnswerOption(question_id: string) {
    const foundIndex = this.survey.question_list.findIndex((i) => i.question_id === question_id);
    const answerOptionLength = this.survey.question_list[foundIndex].answer_option_list.length;
    const newAnswerOption = `답변 옵션 ${answerOptionLength + 1}`;
    this.survey.question_list[foundIndex].answer_option_list.push(newAnswerOption);
  }


  // 특정 질문의 답변옵션 수정
  @Mutation
  private updateAnswerOption({ question_id, answerOptionIndex, answerOption }: {question_id: string,
    answerOptionIndex: number, answerOption: string}) {
    const foundIndex = this.survey.question_list.findIndex((i) => i.question_id === question_id);
    this.survey.question_list[foundIndex].answer_option_list[answerOptionIndex] = answerOption;
  }

  // 특정 질문의 답변옵션 삭제
  @Mutation
  private deleteAnswerOption({ question_id, answerOptionIndex }: { question_id: string, answerOptionIndex: number }) {
    const foundIndex = this.survey.question_list.findIndex((i) => i.question_id === question_id);
    this.survey.question_list[foundIndex].answer_option_list.splice(answerOptionIndex, 1);
  }

  // 설문 저장
  @Mutation
  private saveSurvey() {
    // survey_id 부여는 임시
    // API 연동 이후 삭제 예정
    const survey_id = uniqueId();
    this.surveyList.push({ ...this.survey, survey_id });
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
  public fetchDeleteQuestion(question_id: string) {
    this.deleteQuestion(question_id);
  }

  // 특정 질문 내용 수정
  @Action
  public fetchUpdateQuestionName({ question_id, question_name }: {question_id: string, question_name: string}) {
    this.updateQuestionName({ question_id, question_name });
  }

  // 특정 질문 답변 타입 수정
  @Action
  public fetchUpdateAnswerType({ question_id , answer_type }: {question_id: string, answer_type: number}) {
    this.updateAnswerType({ question_id, answer_type });
  }

  // 특정 질문 답변 옵션 추가
  @Action
  public fetchAddAnswerOption(question_id: string) {
    this.addAnswerOption(question_id);
  }

  // 특정 질문 답변 옵션 수정
  @Action
  public fetchUpdateAnswerOption({ question_id, answerOptionIndex, answerOption }: {question_id: string,
    answerOptionIndex: number, answerOption: string}) {
    this.updateAnswerOption({ question_id, answerOptionIndex, answerOption });
  }

  // 특정 질문 답변 옵션 삭제
  @Action
  public fetchDeleteAnswerOption({ question_id, answerOptionIndex }: {question_id: string, answerOptionIndex: number}) {
    this.deleteAnswerOption({ question_id, answerOptionIndex });
  }

  // 설문 저장
  @Action
  public async fetchSaveSurvey() {
    await this.saveSurvey();
    await this.setInitialSurvey();
    // this.setInitialSurvey();
  }
}
