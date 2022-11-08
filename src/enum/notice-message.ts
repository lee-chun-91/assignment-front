export enum NoticeMessage {
  failSignIn = '',
  successSaveSurvey = '설문지가 저장되었습니다',
  failSaveSurvey = '설문지 저장에 실패했습니다',
  successUpdateSurvey = '설문지가 수정되었습니다',
  needSurveyResponseUserValidate = '해당 설문에 응답했었는지 여부를 체크해서, 응답한 적이 없어야 설문에 참여할 수 있습니다. 응답 여부 체크 페이지로 이동합니다.',
  emptyUserNameField = '응답자 이름을 입력해주세요',
  failSurveyResponseUserValidate = '이미 참여한 설문은 다시 참여할 수 없어요! 다른 설문에 참여해주세요',
  successSaveResponse = '응답이 제출되었습니다',
  failSaveResponse = '응답하지 않은 질문이 있습니다. 질문에 응답값을 체크해주세요.',
  expireToken = '토큰이 만료되었습니다. 다시 로그인해주세요',
  goToPageSignIn = '로그인 하러가기'
}
