<template>
  <div class="survey-log-detail">
    <survey-title :user-name="userName"></survey-title>
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
  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  get userName() {
    return this.$route.params.userName;
  }
  // endregion

  // region local
  // endregion

  // region method
  // getData() {
  //   $surveyStore.fetchGetSurvey(this.surveyId);
  //   return $responseStore.fetchGetLogDetail({ surveyId: this.surveyId, userName: this.userName });
  // }
  // endregion


  // region lifecycle
  async created() {
    await $surveyStore.fetchGetSurvey(this.surveyId);
    await $responseStore.fetchGetLogDetail({ surveyId: this.surveyId, userName: this.userName });
  }

  // mounted() {
  //   console.log('mounted execute page');
  // }
  //
  // updated() {
  //   console.log('updated execute page');
  // }
  // endregion
}
</script>

