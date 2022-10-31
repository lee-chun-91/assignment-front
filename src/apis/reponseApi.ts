import { instance } from './config';
import { IBackResponse } from '@/store/modules/module-response';

export const responseApi = {
  // 특정 설문에 대한 유저 응답 여부 check
  responseUserCheck: ({ user_name, survey_id }: Pick<IBackResponse, 'user_name'|'survey_id'>) => {
    const data = instance.get('api/response/userCheck', { params: { user_name, survey_id } });
    return data;
  },

  saveResponse: (backResponse: IBackResponse) => {
    const data = instance.post('api/response/saveResponse', backResponse);
    return data;
  },

  // 특정 설문에 대한 응답 리스트 get
  getLogList: (page: number, surveyId: string) => {
    const data = instance.get('api/response/getLogList',
      { params: { page, survey_id: surveyId } });
    return data;
  },

  // logDetail get
  getLogDetail: (surveyId: string, userName: string) => {
    const data = instance.get('api/response/getLog',
      { params: { survey_id: surveyId, user_name: userName } });
    return data;
  }
};
