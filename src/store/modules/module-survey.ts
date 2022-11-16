import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { AnswerTypes } from '@/enum/answer-types';
import { surveyApi } from '@/apis/surveyApi';
import { UTILS } from '@/utils/index';
import _ from 'lodash';
import router from '@/router';
import { PageRouteNames } from '@/enum/page-names';

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
  answerOptionList: IAnswerOption[];
}

export interface IBackQuestion {
  question_id : string;
  question_name: string;
  answer_type: number;
  answer_option_list: IAnswerOption[];
}

export interface IAnswerOption {
  id: string,
  text: string,
}

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
        answerType: AnswerTypes.yesNo,
        answerOptionList: [
          { id: UTILS.uuid(), text: '답변 옵션 1' },
          { id: UTILS.uuid(), text: '답변 옵션 2' }
        ],
      },
    ],
  };

  // ---------------------------MUTATION START----------------------------
  @Mutation
  private initSurveyState() {
    const initialSurvey: ISurvey = {
      surveyName: '제목 없는 설문지',
      questionList: [
        { questionId: UTILS.uuid(),
          questionName: '제목 없는 질문',
          answerType: AnswerTypes.yesNo,
          answerOptionList: [
            { id: UTILS.uuid(), text: '답변 옵션 1' },
            { id: UTILS.uuid(), text: '답변 옵션 2' }
          ],
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
  private addQuestion() {
    const newQuestion = {
      questionId: UTILS.uuid(),
      questionName: '제목 없는 질문',
      answerType: AnswerTypes.yesNo,
      answerOptionList: [
        { id: UTILS.uuid(), text: '답변 옵션 1' },
        { id: UTILS.uuid(), text: '답변 옵션 2' }
      ],
    };
    this.survey.questionList.push(newQuestion);
  }

  // 질문 삭제
  @Mutation
  private deleteQuestion(question_id: string) {
    this.survey.questionList = _.filter(this.survey.questionList,(question) => {
      return question.questionId !== question_id;
    } );
  }

  // 질문 내용 수정
  @Mutation
  private updateQuestionName({ questionIndex, questionName }: { questionIndex: number, questionName: string }) {
    this.survey.questionList[questionIndex].questionName = questionName;
  }

  // 질문 답변 타입 수정
  @Mutation
  private updateAnswerType({ questionIndex, answerType }: { questionIndex: number, answerType: number }) {
    this.survey.questionList[questionIndex].answerType = answerType;
    // 답변 타입이 yesNo 일 때 answerOption 을 2개로 고정
    if (answerType === AnswerTypes.yesNo) {
      const leftOption = this.survey.questionList[questionIndex].answerOptionList.slice(0, 2);
      this.survey.questionList[questionIndex].answerOptionList = leftOption;
    }
  }

  // 질문 답변 옵션 추가
  @Mutation
  private addAnswerOption(questionIndex: number) {
    const answerOptionLength =this.survey.questionList[questionIndex].answerOptionList.length;
    const newAnswerOption = { id: UTILS.uuid(), text: `답변 옵션 ${answerOptionLength + 1}` };
    this.survey.questionList[questionIndex].answerOptionList.push(newAnswerOption);
  }


  // 질문 답변 옵션 수정
  @Mutation
  private updateAnswerOption({ questionIndex, answerOptionIndex, answerOption }: {questionIndex: number,
    answerOptionIndex: number, answerOption: string}) {
    this.survey.questionList[questionIndex].answerOptionList[answerOptionIndex].text = answerOption;
  }

  // 질문 답변 옵션 삭제
  @Mutation
  private deleteAnswerOption({ questionIndex, answerOptionIndex }: { questionIndex: number, answerOptionIndex: number }) {
    this.survey.questionList[questionIndex].answerOptionList.splice(answerOptionIndex, 1);
  }

  // 질문 순서 수정
  @Mutation
  private updateQuestionOrder(questionList: IQuestion[]) {
    this.survey.questionList = questionList;
  }


  // 설문 리스트 get
  @Mutation
  private getSurveyList(backSurveyList: IBackSurveyList) {
    const data: ISurvey[] = _.map(backSurveyList.data, (backSurvey) => {
      const questionList: IQuestion[] = _.map(backSurvey.question_list, (backQuestion) => {
        return {
          questionId: backQuestion.question_id,
          questionName: backQuestion.question_name,
          answerType: backQuestion.answer_type,
          answerOptionList: backQuestion.answer_option_list
        };});

      return {
        _id: backSurvey._id,
        surveyName: backSurvey.survey_name,
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
    const questionList = _.map(backSurvey.question_list, (backQuestion) => { return {
      questionId: backQuestion.question_id,
      questionName: backQuestion.question_name,
      answerType: backQuestion.answer_type,
      answerOptionList: backQuestion.answer_option_list,
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
    this.addQuestion();
  }

  // 질문 삭제
  @Action
  public fetchDeleteQuestion(questionId: string) {
    this.deleteQuestion(questionId);
  }

  // 질문 내용 수정
  @Action
  public fetchUpdateQuestionName({ questionIndex, questionName }: { questionIndex: number, questionName: string }) {
    this.updateQuestionName({ questionIndex, questionName });
  }

  // 질문 답변 타입 수정
  @Action
  public fetchUpdateAnswerType({ questionIndex , answerType }: { questionIndex: number, answerType: number }) {
    this.updateAnswerType({ questionIndex, answerType });
  }

  // 질문 답변 옵션 추가
  @Action
  public fetchAddAnswerOption(questionIndex: number,) {
    this.addAnswerOption(questionIndex);
  }

  // 질문 답변 옵션 수정
  @Action
  public fetchUpdateAnswerOption({ questionIndex, answerOptionIndex, answerOption }: {questionIndex: number,
    answerOptionIndex: number, answerOption: string}) {
    this.updateAnswerOption({ questionIndex, answerOptionIndex, answerOption });
  }

  // 질문 답변 옵션 삭제
  @Action
  public fetchDeleteAnswerOption({ questionIndex, answerOptionIndex }: { questionIndex: number, answerOptionIndex: number }) {
    this.deleteAnswerOption({ questionIndex, answerOptionIndex });
  }

  // 질문 순서 변경
  @Action
  public fetchUpdateQuestionOrder(questionList: IQuestion[]){
    this.updateQuestionOrder(questionList);
  }

  // 설문 저장
  @Action({ rawError: true })
  public async fetchSaveSurvey() {
    // const emptyQuestionNameList = _.filter(this.survey.questionList, (q) => q.questionName === '');
    //
    // if (this.survey.surveyName === '') {
    //   console.log(Promise.reject());
    //   return Promise.reject(NoticeMessages.emptySurveyName);
    // }
    // else if (emptyQuestionNameList.length !== 0) {
    //   return Promise.reject(NoticeMessages.emptyQuestionName);
    // }

    const question_list: IBackQuestion[]  = _.map(this.survey.questionList, (question) => {
      return {
        question_id : question.questionId,
        question_name: question.questionName,
        answer_type: question.answerType,
        answer_option_list: question.answerOptionList,
      }; });

    const backSurvey: IBackSurvey = {
      survey_name: this.survey.surveyName,
      question_list
    };

    return await surveyApi.saveSurvey(backSurvey)
      .then((result) => { return Promise.resolve(result); })
      .catch((error) => { return Promise.reject(error); });
  }

  @Action
  public fetchInitSurveyState() {
    this.initSurveyState();
  }

  // 설문 리스트 get
  @Action({ rawError: true })
  public async fetchGetSurveyList(page: number) {
    await surveyApi.getSurveyList(page)
      .then((res) => { this.getSurveyList(res.data); });
  }

  // 설문 get
  @Action({ rawError: true })
  public async fetchGetSurvey(surveyId: string) {
    return await surveyApi.getSurvey(surveyId)
      .then((res) => {
        // console.log('res', res);
        this.setSurvey(res.data);
      })
      .catch((error) => {
        // console.log('error', error);
        router.push({ name: PageRouteNames.notFound });
      } );
  }

  // 설문 수정
  @Action({ rawError: true })
  public async fetchUpdateSurvey(surveyId: string) {

    // form validation. element ui 적용 시 수정
    // const emptyQuestionNameList = this.survey.questionList.filter((q) => q.questionName === '');
    //
    // if (this.survey.surveyName === '') {
    //   return Promise.reject('설문 제목이 비어있습니다. 설문 제목을 입력해주세요');
    // }
    // else if (emptyQuestionNameList.length !== 0) {
    //   return Promise.reject('비어있는 질문이 있습니다. 모든 질문에 내용을 입력해주세요.');
    // }

    const question_list: IBackQuestion[]  = _.map(this.survey.questionList, (question) => {
      return {
        question_id : question.questionId,
        question_name: question.questionName,
        answer_type: question.answerType,
        answer_option_list: question.answerOptionList,
      }; });

    const backSurvey: IBackSurvey = {
      survey_name: this.survey.surveyName,
      question_list: question_list
    };

    return await surveyApi.updateSurvey({ surveyId, backSurvey })
      .then((result) => { return Promise.resolve(result); });
  }
}
