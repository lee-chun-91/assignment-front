import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import PageAdminMain from '@/pages/page-admin-main.vue';
import PageSurveyCreate from '@/pages/page-survey-create.vue';
import PageSurveyUpdate from '@/pages/page-survey-update.vue';
import PageSurveyReport from '@/pages/page-survey-report.vue';
import PageSurveyLog from '@/pages/page-survey-log.vue';
import PageSurveyLogDetail from '@/pages/page-survey-log-detail.vue';
import PageSurveyResponse from '@/pages/page-survey-response.vue';
import DefaultLayout from '@/layouts/default-layout.vue';
import EmptyLayout from '@/layouts/empty-layout.vue';
import PageSignIn from '@/pages/page-sign-in.vue';
import { $adminStore } from '@/store';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [

  // 버그 확인
  {
    path: '/',
    name: '관리자 메인',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: '관리자 메인',
        component: PageAdminMain,
      },
      {
        path: 'create',
        name: '설문지 생성',
        component: PageSurveyCreate,
      },
      {
        path: 'update/:surveyId',
        name: '설문지 수정',
        component: PageSurveyUpdate,
      },
      {
        path: 'report/:surveyId',
        name: '설문 리포트',
        component: PageSurveyReport,
      },
      {
        path: 'log/:surveyId',
        name: '설문 로그',
        component: PageSurveyLog,
      },
      {
        path: 'log/:surveyId/:userName',
        name: '개별 로그',
        component: PageSurveyLogDetail,
      },

    ]
  },
  {
    path: '/',
    component: EmptyLayout,
    children: [
      {
        path: 'signIn',
        name: '로그인',
        component: PageSignIn,
      },
      {
        path: 'response/:surveyId',
        name: '설문 응답',
        component: PageSurveyResponse,
      },
    ]
  }
];

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  // 로컬 스토리지에 유저정보 저장 여부 확인
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('accessToken');

  // 유저정보 없으면 회원가입 화면으로
  if( (!username) && (!token) && (to.name !== '로그인')) {next({ name: '로그인' });}
  // 유저정보 있으면 유저 정보 vuex state 에 세팅
  else {
    $adminStore.fetchSetLoggedInfo();
    next();
  }
});


export default router;
