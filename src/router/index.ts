import Vue from 'vue';
import VueRouter, { Route, RouteConfig } from 'vue-router';
import PageAdminMain from '@/pages/page-admin-main.vue';
import PageSurveyCreate from '@/pages/page-survey-create.vue';
import PageSurveyUpdate from '@/pages/page-survey-update.vue';
import PageSurveyReport from '@/pages/page-survey-report.vue';
import PageSurveyLog from '@/pages/page-survey-log.vue';
import PageSurveyLogDetail from '@/pages/page-survey-log-detail.vue';
import PageSurveyResponse from '@/pages/page-survey-response.vue';
import PageSignIn from '@/pages/page-sign-in.vue';
import PageNotFound from '@/pages/page-not-found.vue';
import pageSurveyResponseUserValidate from '@/pages/page-survey-response-user-validate.vue';

import { $adminStore } from '@/store';
import { getCookie } from '@/utils/cookie';
import { PageRouteNames } from '@/enum/page-names';
import { ObjectId } from 'bson';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: PageRouteNames.adminMain,
    component: PageAdminMain,
    meta: {
      breadCrumb: [
        {
          text: PageRouteNames.adminMain,
        }
      ]
    }
  },
  {
    path: '/create',
    name: PageRouteNames.surveyCreate,
    component: PageSurveyCreate,
  },

  {
    path: '/update/:surveyId',
    name: PageRouteNames.surveyUpdate,
    component: PageSurveyUpdate,
    meta: {
      breadCrumb(route: Route) {
        const surveyId = route.params.surveyId;
        return [
          {
            text: PageRouteNames.adminMain,
            to: { name: PageRouteNames.adminMain }
          },
          {
            text: surveyId,
          }
        ];
      }
    },
  },
  {
    path: '/report/:surveyId',
    name: PageRouteNames.surveyReport,
    component: PageSurveyReport,
  },
  {
    path: '/log/:surveyId',
    name: PageRouteNames.surveyLog,
    component: PageSurveyLog,
  },
  {
    path: '/log/:surveyId/:userName',
    name: PageRouteNames.surveyLogDetail,
    component: PageSurveyLogDetail,
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
  },
  {
    path: '*',
    name: PageRouteNames.notFound,
    component: PageNotFound
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach(async (to, from, next) => {
  // 쿠키에 유저정보 저장 여부 확인
  const userName = getCookie('userName');
  const token = getCookie('accessToken');

  // 1. 유저가 url params surveyId 에 임의값 입력 시 가드
  if(to.params.surveyId) {
    if (!ObjectId.isValid(to.params.surveyId)) {
      router.push({ name: PageRouteNames.notFound });
    }
  }

  // 2. 설문 참여 페이지에는 관리자 로그인 여부 확인 안하고 이동
  if (to.name === PageRouteNames.surveyResponseUserValidate || to.name === PageRouteNames.surveyResponse ) {
    next();
  }

  // 3-1. 관리자 페이지 접근 시 쿠키에 관리자 정보 없으면, 로그인 화면으로 이동
  else if( (!userName) && (!token) && (to.name !== PageRouteNames.signIn)) {
    console.log(to.params);
    next({ name: PageRouteNames.signIn });
  }

  // 3-2 관리자 페이지 접근 시 쿠키에 관리자 정보 있으면, 관리자 정보 vuex state 에 세팅
  else {
    $adminStore.fetchSetLoggedInfo();
    next();
  }
});


export default router;
