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
import PageSignIn from '@/pages/page-sign-in.vue';
import PageNotFound from '@/pages/page-not-found.vue';
import pageSurveyResponseUserValidate from '@/pages/page-survey-response-user-validate.vue';

import { $adminStore } from '@/store';
import { getCookie } from '@/utils/cookie';
import { PageRouteNames } from '@/enum/page-names';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [

  // 버그 확인
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: PageRouteNames.adminMain,
        component: PageAdminMain,
      },
      {
        path: 'create',
        name: PageRouteNames.surveyCreate,
        component: PageSurveyCreate,
      },
      {
        path: 'update/:surveyId',
        name: PageRouteNames.surveyUpdate,
        component: PageSurveyUpdate,
      },
      {
        path: 'report/:surveyId',
        name: PageRouteNames.surveyReport,
        component: PageSurveyReport,
      },
      {
        path: 'log/:surveyId',
        name: PageRouteNames.surveyLog,
        component: PageSurveyLog,
      },
      {
        path: 'log/:surveyId/:userName',
        name: PageRouteNames.surveyLogDetail,
        component: PageSurveyLogDetail,
      },

    ]
  },
  {
    path: '/signIn',
    name: PageRouteNames.signIn,
    component: PageSignIn,
  },
  {
    path: '/response/:surveyId',
    name: PageRouteNames.surveyResponseUserValidate,
    component: pageSurveyResponseUserValidate,
  },
  {
    path: '/response/:surveyId/:userName',
    name: PageRouteNames.surveyResponse,
    component: PageSurveyResponse,

    // beforeEnter 는 라우팅이 다시 될 때에 페이지 들어가기 전 실행된다.

    // beforeEnter: (to, from, next) => {
    //   console.log(to, from);
    //   if(from.name !== PageRouteNames.userCheck) {
    //     next({ name: PageRouteNames.userCheck });
    //   }
    //   else {
    //     next();
    //   }
    // }
  },
  {
    path: '*',
    component: PageNotFound
  }
];

const router = new VueRouter({
  // mode: 'history',
  routes
});

router.beforeEach(async (to, from, next) => {
  // 쿠키에 유저정보 저장 여부 확인
  const userName = getCookie('userName');
  const token = getCookie('accessToken');

  // 설문 참여 페이지에는 관리자 로그인 여부 확인 안하고 이동
  if (to.name === PageRouteNames.surveyResponseUserValidate || to.name === PageRouteNames.surveyResponse ) {
    next();
  }

  // 관리자 페이지 접근 시 쿠키에 관리자 정보 없으면, 로그인 화면으로 이동
  else if( (!userName) && (!token) && (to.name !== PageRouteNames.signIn)) {next({ name: PageRouteNames.signIn });}

  // 관리자 페이지 접근 시 쿠키에 관리자 정보 있으면, 관리자 정보 vuex state 에 세팅
  else {
    $adminStore.fetchSetLoggedInfo();
    next();
  }
});


export default router;
