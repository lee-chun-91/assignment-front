import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
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
  // ????????? ???????????? ?????? ?????? ??????
  const userName = getCookie('userName');
  const token = getCookie('accessToken');

  // 1. ????????? url params surveyId ??? ????????? ?????? ??? ??????
  if(to.params.surveyId) {
    if (!ObjectId.isValid(to.params.surveyId)) {
      router.push({ name: PageRouteNames.notFound });
    }
  }

  // 2. ?????? ?????? ??????????????? ????????? ????????? ?????? ?????? ????????? ??????
  if (to.name === PageRouteNames.surveyResponseUserValidate || to.name === PageRouteNames.surveyResponse ) {
    next();
  }

  // 3-1. ????????? ????????? ?????? ??? ????????? ????????? ?????? ?????????, ????????? ???????????? ??????
  else if( (!userName || !token) && (to.name !== PageRouteNames.signIn)) {
    console.log(userName);
    console.log(token);
    next({ name: PageRouteNames.signIn });
  }

  // 3-2 ????????? ????????? ?????? ??? ????????? ????????? ?????? ?????????, ????????? ?????? vuex state ??? ??????
  else {
    $adminStore.fetchSetLoggedInfo();
    next();
  }
});


export default router;
