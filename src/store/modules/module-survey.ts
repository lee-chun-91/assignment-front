import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { AnswerTypes } from '@/enum/answer-types';
import { surveyApi } from '@/apis/surveyApi';
import { UTILS } from '@/utils/index';
import _ from 'lodash';

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
  private addQuestion(question: IQuestion) {
    this.survey.questionList.push(question);
  }

  // 질문 삭제
  @Mutation
  private deleteQuestion(question_id: string) {
    this.survey.questionList = _.filter(this.survey.questionList,(question) => {
      return question.questionId !== question_id;
    } );

    // this.survey.questionList = this.survey.questionList.filter(
    //   (item) => item.questionId !== question_id
    // );
  }

  // 질문 내용 수정
  @Mutation
  private updateQuestionName({ questionId, questionName }: Pick<IQuestion, 'questionId'|'questionName'>) {
    _.forEach(this.survey.questionList, (question) => {
      if(question.questionId === questionId) {
        question.questionName = questionName;
      }
    });

    // const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    // this.survey.questionList[foundIndex] = { ...this.survey.questionList[foundIndex], questionName };
  }

  // 질문 답변 타입 수정
  @Mutation
  private updateAnswerType({ questionId, answerType }: Pick<IQuestion, 'questionId'|'answerType'>) {
    _.forEach(this.survey.questionList, (question) => {
      if(question.questionId === questionId) {
        question.answerType = answerType;
      }
    });

    // const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    // this.survey.questionList[foundIndex].answerType = answerType;
  }

  // 질문 답변 옵션 추가
  @Mutation
  private addAnswerOption(questionId: string) {
    _.forEach(this.survey.questionList, (question) => {
      if(question.questionId === questionId) {
        const answerOptionLength = question.answerOptionList.length;
        const newAnswerOption = { id: UTILS.uuid(), text: `답변 옵션 ${answerOptionLength + 1}` };
        question.answerOptionList.push(newAnswerOption);
      }
    });

    // const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    // const answerOptionLength = this.survey.questionList[foundIndex].answerOptionList.length;
    // const newAnswerOption = { id: UTILS.uuid(), text: `답변 옵션 ${answerOptionLength + 1}` };
    // this.survey.questionList[foundIndex].answerOptionList.push(newAnswerOption);
  }


  // 질문 답변 옵션 수정
  @Mutation
  private updateAnswerOption({ questionId, answerOptionIndex, answerOption }: {questionId: string,
    answerOptionIndex: number, answerOption: string}) {
    _.forEach(this.survey.questionList, (question) => {
      if(question.questionId === questionId) {
        question.answerOptionList[answerOptionIndex].text = answerOption;
      }
    });

    // const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    // this.survey.questionList[foundIndex].answerOptionList[answerOptionIndex].text = answerOption;
  }

  // 질문 답변 옵션 삭제
  @Mutation
  private deleteAnswerOption({ questionId, answerOptionIndex }: { questionId: string, answerOptionIndex: number }) {
    _.forEach(this.survey.questionList, (question) => {
      if(question.questionId === questionId) {
        question.answerOptionList.slice(answerOptionIndex, 1);
      }
    });

    // const foundIndex = this.survey.questionList.findIndex((i) => i.questionId === questionId);
    // this.survey.questionList[foundIndex].answerOptionList.splice(answerOptionIndex, 1);
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

    // const data: ISurvey[] = backSurveyList.data.map((s) => {
    //   const questionList: IQuestion[] = s.question_list.map((q) => {return {
    //     questionId: q.question_id,
    //     questionName: q.question_name,
    //     answerType: q.answer_type,
    //     answerOptionList: q.answer_option_list
    //   };});
    //
    //   return {
    //     _id: s._id,
    //     surveyName: s.survey_name,
    //     questionList,
    //   };});


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
    const questionList = backSurvey.question_list.map((backQuestion) => {return {
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
    const newQuestion = {
      questionId: UTILS.uuid(),
      questionName: '제목 없는 질문',
      answerType: AnswerTypes.yesNo,
      answerOptionList: [
        { id: UTILS.uuid(), text: '답변 옵션 1' },
        { id: UTILS.uuid(), text: '답변 옵션 2' }
      ],
    };
    this.addQuestion(newQuestion);
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

    // form validation, element ui 적용 시 수정
    const emptyQuestionNameList = this.survey.questionList.filter((q) => q.questionName === '');

    if (this.survey.surveyName === '') {
      console.log(Promise.reject('설문 제목이 비어있습니다. 설문 제목을 입력해주세요'));
      return Promise.reject('설문 제목이 비어있습니다. 설문 제목을 입력해주세요');
    }
    else if (emptyQuestionNameList.length !== 0) {
      return Promise.reject('비어있는 질문이 있습니다. 모든 질문에 내용을 입력해주세요.');
    }

    // form validation 통과 시

    const question_list: IBackQuestion[]  = _.map(this.survey.questionList, (question) => {
      return {
        question_id : question.questionId,
        question_name: question.questionName,
        answer_type: question.answerType,
        answer_option_list: question.answerOptionList,
      }; });

    // const question_list: IBackQuestion[]  = this.survey.questionList.map((q) => { return {
    //   question_id : q.questionId,
    //   question_name: q.questionName,
    //   answer_type: q.answerType,
    //   answer_option_list: q.answerOptionList,
    // }; });

    const backSurvey: IBackSurvey = {
      survey_name: this.survey.surveyName,
      question_list
    };

    return await surveyApi.saveSurvey(backSurvey)
      .then((res) => {
        // console.log('saveSurvey result', res);
        // this.initSurveyState();
      })
      .catch((error) => { return Promise.reject(error); });
  }

  @Action
  public fetchInitSurveyState() {
    this.initSurveyState();
  }

  // 설문 리스트 get
  @Action
  public async fetchGetSurveyList(page: number) {
    await surveyApi.getSurveyList(page)
      .then((res) => {
        this.getSurveyList(res.data);
      });
  }

  // 설문 get
  @Action
  public async fetchGetSurvey(surveyId: string) {
    return await surveyApi.getSurvey(surveyId)
      .then((res) => this.setSurvey(res.data));
  }

  // 설문 수정
  @Action({ rawError: true })
  public async fetchUpdateSurvey(surveyId: string) {

    // form validation. element ui 적용 시 수정
    const emptyQuestionNameList = this.survey.questionList.filter((q) => q.questionName === '');

    if (this.survey.surveyName === '') {
      return Promise.reject('설문 제목이 비어있습니다. 설문 제목을 입력해주세요');
    }
    else if (emptyQuestionNameList.length !== 0) {
      return Promise.reject('비어있는 질문이 있습니다. 모든 질문에 내용을 입력해주세요.');
    }

    const question_list: IBackQuestion[]  = _.map(this.survey.questionList, (question) => {
      return {
        question_id : question.questionId,
        question_name: question.questionName,
        answer_type: question.answerType,
        answer_option_list: question.answerOptionList,
      }; });

    // const question_list: IBackQuestion[]  = this.survey.questionList.map((q) => { return {
    //   question_id : q.questionId,
    //   question_name: q.questionName,
    //   answer_type: q.answerType,
    //   answer_option_list: q.answerOptionList,
    // }; });

    const backSurvey: IBackSurvey = {
      survey_name: this.survey.surveyName,
      question_list: question_list
    };

    return await surveyApi.updateSurvey({ surveyId, backSurvey })
      .then((result) => {
        console.log('update api then result', result);
        return Promise.resolve(result);
      });
  }
}
