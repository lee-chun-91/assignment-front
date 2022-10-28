import { instance } from './config';
import { IBackSurvey, ISurvey } from '@/store/modules/module-survey';

export const surveyApi = {
  // 설문지 get
  getSurvey: (surveyId: string) => {
    const data = instance.get('api/survey/getSurvey',
      { params: { survey_id: surveyId } });
    return data;
  },

  // 설문지 저장
  saveSurvey: (survey: IBackSurvey) => {
    const data = instance.post('api/survey/saveSurvey', survey);
    return data;
  },

  // 설문지 수정
  updateSurvey: ({ surveyId, backSurvey }: {surveyId: string, backSurvey:IBackSurvey}) => {
    const data = instance.post(`api/survey/updateSurvey/${surveyId}`, backSurvey);
    return data;
  },

  // 설문지 상태 변경 (토글 버튼 연동)
  changeSurveyStatus: () => {return;},

  //
  getSurveyList: (page: number) => {
    const data = instance.get('api/survey/getSurveyList',
      { params: { page: page } });
    return data;
  },
};
