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
import { $adminStore, $surveyStore } from '@/store';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    // name: 'defaultLayout',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'adminMain',
        component: PageAdminMain,
      },
      {
        path: 'create',
        name: 'surveyCreate',
        component: PageSurveyCreate,
      },
      {
        path: 'update/:surveyId',
        name: 'surveyUpdate',
        component: PageSurveyUpdate,
      },
      {
        path: 'report/:surveyId',
        name: 'surveyReport',
        component: PageSurveyReport,
      },
      {
        path: 'log/:surveyId',
        name: 'surveyLog',
        component: PageSurveyLog,
      },
      {
        path: 'log/:surveyId/:respondentName',
        name: 'surveyLogDetail',
        component: PageSurveyLogDetail,
      },

    ]
  },
  {
    path: '/',
    // name: 'emptyLayout',
    component: EmptyLayout,
    children: [
      {
        path: 'signIn',
        name: 'signIn',
        component: PageSignIn,
        // beforeEnter(to, from, next) {
        //   if(localStorage.getItem('accessToken')){
        //     next({ name:'adminMain' });
        //   }else{
        //     return false;
        //   }
        // }
      },
      {
        path: 'response/:surveyId',
        name: 'surveyResponse',
        component: PageSurveyResponse,
      },
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  // 로컬 스토리지에 유저정보 저장 여부 확인
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('accessToken');

  // 유저정보 없으면 회원가입 화면으로
  if( (!username) && (!token) && (to.name !== 'signIn')) {next({ name: 'signIn' });}
  // 유저정보 있으면 setLoggedInfo
  else {
    $adminStore.fetchSetLoggedInfo();
    next();
  }
});


export default router;
