<template>
  <div class="survey-log-detail">
    <survey-title></survey-title>
    <question-list :isLog="true"></question-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SurveyTitle from '@/components/survey-response-and-log/survey-title.vue';
import QuestionList from '@/components/survey-response-and-log/question-list.vue';
import { $responseStore, $surveyStore } from '@/store';

@Component({ components: { QuestionList, SurveyTitle  } })
export default class PageSurveyLogDetail extends Vue {
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

  // region lifecycle
  async created() {
    await $responseStore.fetchGetLogDetail({ surveyId: this.surveyId, userName: this.userName });
    await $surveyStore.fetchGetSurvey(this.surveyId);
    console.log('this', this);
    console.log('this.$route', this.$route);
  }
  // endregion
}
</script>
