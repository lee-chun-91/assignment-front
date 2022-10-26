import Vue from 'vue';
import Vuex from 'vuex';
import ModuleSurvey from '@/store/modules/module-survey';
import { getModule } from 'vuex-module-decorators';
import ModuleResponse from '@/store/modules/module-response';
import ModuleAdmin from '@/store/modules/module-admin';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    survey: ModuleSurvey,
    response: ModuleResponse,
    admin: ModuleAdmin,
  }
});

export const $surveyStore = getModule(ModuleSurvey, store);
export const $responseStore = getModule(ModuleResponse, store);
export const $adminStore = getModule(ModuleAdmin, store);
