<template>
  <div class="survey-log-detail">
    <survey-title></survey-title>
    <question-list :isLog="true"></question-list>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import SurveyTitle from '@/components/survey-response/survey-title.vue';
import QuestionList from '@/components/survey-response/question-list.vue';
import AtomicInput from '@/components/sign-in/atomic-input.vue';
import { $responseStore, $surveyStore } from '@/store';

@Component({ components: { QuestionList, SurveyTitle  } })
export default class PageSurveyLogDetail extends Vue {
  // region prop
  // endregion

  // region local
  logDetailData = {
    surveyName: '',
    userName: '',
    questionAnswer: [{
      questionId: '',
      answerType: 0,
      answerOption: [],
      answer: [],
    }]
  }
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  get userName() {
    return this.$route.params.userName;
  }
  // endregion

  // region method
  // endregion

  // region emit
  // endregion

  // region lifecycle
  async created() {
    await $responseStore.fetchGetLogDetail({ surveyId: this.surveyId, userName: this.userName });
    await $surveyStore.fetchGetSurvey(this.surveyId);
    console.log('logDetail in page', $responseStore.logDetail);
    console.log('survey data in page', $surveyStore.survey);

  }
  // endregion
}
</script>
