import { instance } from './config';
import { IBackResponse } from '@/store/modules/module-response';

export const responseApi = {
  // 특정 설문에 대한 유저 응답 여부 check
  responseUserChecK: ({ user_name, survey_id }: Pick<IBackResponse, 'user_name'|'survey_id'>) => {
    const data = instance.get('api/response/userCheck', { params: { user_name, survey_id } });
    return data;
  },

  saveResponse: (backResponse: IBackResponse) => {
    const data = instance.post('api/response/saveResponse', backResponse);
    return data;
  },

  // 특정 설문에 대한 응답 리스트 get
  getResponseList: (page: number) => {
    const data = instance.get('api/response/getSurveyList',
      { params: { page: page } });
    return data;
  },

  //
};
