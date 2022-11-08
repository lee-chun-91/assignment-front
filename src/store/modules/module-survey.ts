import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { QuestionTypes } from '@/enum/question-types';
import { surveyApi } from '@/apis/surveyApi';
import { UTILS } from '@/utils/index';

export interface ISurveyList {
  total: number;
  perPage: number;
  data: ISurvey[];
}

export interface IBackSurveyList {
  total: number;
  per_page: number;
  data: IBackSurvey[];
}

export interface ISurvey {
  _id?: string;
  surveyName: string;
  questionList: IQuestion[];
}

export interface IBackSurvey {
  _id?: string;
  survey_name: string;
  question_list: IBackQuestion[];
}

export interface IQuestion {
  questionId : string;
  questionName: string;
  answerType: number;
  answerOptionList: string[];
}

export interface IBackQuestion {
  question_id : string;
  question_name: string;
  answer_type: number;
  answer_option_list: string[];
}

const newQuestion = (newId: string) => ({
  questionId: newId,
  questionName: '제목 없는 질문',
  answerType: QuestionTypes.yesNo,
  answerOptionList: ['답변 옵션 1', '답변 옵션 2'],
});


@Module({ namespaced: true, name: 'survey' })
export default class ModuleSurvey extends VuexModule {
  surveyList: ISurveyList = {
    total: 0,
    perPage: 0,
    data: []
  }
  survey: ISurvey = {
    surveyName: '제목 없는 설문지',
    questionList: [
      { questionId: UTILS.uuid(),
        questionName: '제목 없는 질문',
        answerType: QuestionTypes.yesNo,
        answerOptionList: ['답변 옵션 1', '답변 옵션 2'],
      },
    ],
  };

  // ---------------------------MUTATION START----------------------------
  @Mutation
  private setInitialSurvey() {
    const initialSurvey: ISurvey = {
      surveyName: '제목 없는 설문지',
      questionList: [
        { questionId: UTILS.uuid(),
          questionName: '제목 없는 질문',
          answerType: QuestionTypes.yesNo,
          answerOptionList: ['답변 옵션 1', '답변 옵션 2'],
        },
      ],
    };
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
  private deleteQuestion(question_id: string) {
    this.survey.questionList = this.survey.questionList.filter(
      (item) => item.questionId !== question_id
    );
  }

  // 질문 내용 수정
  @Mutation
  private updateQuestionName({ questionId, questionName }: Pick<IQuestion, 'questionId'|'questionName'>) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    this.survey.questionList[foundIndex] = { ...this.survey.questionList[foundIndex], questionName };
  }

  // 질문 답변 타입 수정
  @Mutation
  private updateAnswerType({ questionId, answerType }: Pick<IQuestion, 'questionId'|'answerType'>) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    this.survey.questionList[foundIndex].answerType = answerType;
  }

  // 질문 답변 옵션 추가
  @Mutation
  private addAnswerOption(questionId: string) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    const answerOptionLength = this.survey.questionList[foundIndex].answerOptionList.length;
    const newAnswerOption = `답변 옵션 ${answerOptionLength + 1}`;
    this.survey.questionList[foundIndex].answerOptionList.push(newAnswerOption);
  }


  // 질문 답변 옵션 수정
  @Mutation
  private updateAnswerOption({ questionId, answerOptionIndex, answerOption }: {questionId: string,
    answerOptionIndex: number, answerOption: string}) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    this.survey.questionList[foundIndex].answerOptionList[answerOptionIndex] = answerOption;
  }

  // 질문 답변 옵션 삭제
  @Mutation
  private deleteAnswerOption({ questionId, answerOptionIndex }: { questionId: string, answerOptionIndex: number }) {
    const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    this.survey.questionList[foundIndex].answerOptionList.splice(answerOptionIndex, 1);
  }

  // 질문 순서 수정
  @Mutation
  private updateQuestionOrder(questionList: IQuestion[]) {
    this.survey.questionList = questionList;
  }


  // 설문 리스트 get
  @Mutation
  private getSurveyList(backSurveyList: IBackSurveyList) {
    const data: ISurvey[] = backSurveyList.data.map((s) => {
      const questionList: IQuestion[] = s.question_list.map((q) => {return {
        questionId: q.question_id,
        questionName: q.question_name,
        answerType: q.answer_type,
        answerOptionList: q.answer_option_list
      };});

      return {
        _id: s._id,
        surveyName: s.survey_name,
        questionList,
      };});

    const surveyList: ISurveyList = {
      total: backSurveyList.total,
      perPage: backSurveyList.per_page,
      data
    };

    this.surveyList = surveyList;
  }

  // 설문 get
  @Mutation
  private setSurvey(backSurvey: IBackSurvey) {
    const questionList = backSurvey.question_list.map((q) => {return {
      questionId: q.question_id,
      questionName: q.question_name,
      answerType: q.answer_type,
      answerOptionList: q.answer_option_list,
    };});

    const frontSurvey: ISurvey = {
      _id: backSurvey._id,
      surveyName: backSurvey.survey_name,
      questionList,
    };
    this.survey = frontSurvey;
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
    const newId = UTILS.uuid();
    this.addQuestion(newQuestion(newId));
  }

  // 질문 삭제
  @Action
  public fetchDeleteQuestion(questionId: string) {
    this.deleteQuestion(questionId);
  }

  // 질문 내용 수정
  @Action
  public fetchUpdateQuestionName({ questionId, questionName }: Pick<IQuestion, 'questionId'|'questionName'>) {
    this.updateQuestionName({ questionId, questionName });
  }

  // 질문 답변 타입 수정
  @Action
  public fetchUpdateAnswerType({ questionId , answerType }: Pick<IQuestion, 'questionId'|'answerType'>) {
    this.updateAnswerType({ questionId, answerType });
  }

  // 질문 답변 옵션 추가
  @Action
  public fetchAddAnswerOption(questionId: string) {
    this.addAnswerOption(questionId);
  }

  // 질문 답변 옵션 수정
  @Action
  public fetchUpdateAnswerOption({ questionId, answerOptionIndex, answerOption }: {questionId: string,
    answerOptionIndex: number, answerOption: string}) {
    this.updateAnswerOption({ questionId, answerOptionIndex, answerOption });
  }

  // 질문 답변 옵션 삭제
  @Action
  public fetchDeleteAnswerOption({ questionId, answerOptionIndex }: {questionId: string, answerOptionIndex: number}) {
    this.deleteAnswerOption({ questionId, answerOptionIndex });
  }

  // 질문 순서 변경
  @Action
  public fetchUpdateQuestionOrder(questionList: IQuestion[]){
    this.updateQuestionOrder(questionList);
  }

  // 설문 저장
  @Action({ rawError: true })
  public async fetchSaveSurvey() {
    // form validation
    const emptyQuestionNameList = this.survey.questionList.filter((q) => q.questionName === '');

    if (this.survey.surveyName === '') {
      console.log(Promise.reject('설문 제목이 비어있습니다. 설문 제목을 입력해주세요'));
      return Promise.reject('설문 제목이 비어있습니다. 설문 제목을 입력해주세요');
    }
    else if (emptyQuestionNameList.length !== 0) {
      return Promise.reject('비어있는 질문이 있습니다. 모든 질문에 내용을 입력해주세요.');
    }

    // form validation 통과 시
    const question_list: IBackQuestion[]  = this.survey.questionList.map((q) => { return {
      question_id : q.questionId,
      question_name: q.questionName,
      answer_type: q.answerType,
      answer_option_list: q.answerOptionList,
    }; });

    const backSurvey: IBackSurvey = {
      survey_name: this.survey.surveyName,
      question_list: question_list
    };

    return await surveyApi.saveSurvey(backSurvey)
      .then((res) => {
        console.log('saveSurvey result', res);
        this.setInitialSurvey();
      })
      .catch((error) => console.log(error));
  }

  @Action
  public fetchSetInitialSurvey() {
    this.setInitialSurvey();
  }

  // 설문 리스트 get
  @Action
  public async fetchGetSurveyList(page: number) {
    await surveyApi.getSurveyList(page)
      .then((res) => {
        this.getSurveyList(res.data);
      });
    // .catch((error) => console.log(error));
  }

  // 설문 get
  @Action
  public async fetchGetSurvey(surveyId: string) {
    return await surveyApi.getSurvey(surveyId)
      .then((res) => this.setSurvey(res.data));
    // .catch((error) => console.log(error));
  }

  // 설문 수정
  @Action({ rawError: true })
  public async fetchUpdateSurvey(surveyId: string) {
    // form validation
    const emptyQuestionNameList = this.survey.questionList.filter((q) => q.questionName === '');

    if (this.survey.surveyName === '') {
      return Promise.reject('설문 제목이 비어있습니다. 설문 제목을 입력해주세요');
    }
    else if (emptyQuestionNameList.length !== 0) {
      return Promise.reject('비어있는 질문이 있습니다. 모든 질문에 내용을 입력해주세요.');
    }

    const question_list: IBackQuestion[]  = this.survey.questionList.map((q) => { return {
      question_id : q.questionId,
      question_name: q.questionName,
      answer_type: q.answerType,
      answer_option_list: q.answerOptionList,
    }; });

    const backSurvey: IBackSurvey = {
      survey_name: this.survey.surveyName,
      question_list: question_list
    };

    return await surveyApi.updateSurvey({ surveyId, backSurvey })
      .then((res) => {
        this.setInitialSurvey();
      });
    // .catch((error) => console.log(error));
  }
}
