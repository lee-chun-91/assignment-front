import Vue from 'vue';
import Vuex from 'vuex';
import ModuleSurvey from '@/store/modules/module-survey';
import { getModule } from 'vuex-module-decorators';
import ModuleResponse from '@/store/modules/module-response';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    survey: ModuleSurvey,
    response: ModuleResponse,
  }
});

export const $surveyStore = getModule(ModuleSurvey, store);
export const $responseStore = getModule(ModuleResponse, store);
