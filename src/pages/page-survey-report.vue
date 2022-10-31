<template>
  <div class="survey-report">
    <div>총 참여자</div>
    <div>금일 참여자</div>
    <div>
      survey.questionList 에서 question 순회하며 report-question 컴포넌트 띄우기
      <report-question></report-question>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import ReportQuestion from '@/components/survey-report/report-question.vue';
import { $responseStore } from '@/store';

@Component({
  components: { ReportQuestion }
})
export default class PageSurveyReport extends Vue {
  // region prop
  // endregion

  // region local
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }
  // endregion

  // region method
  // endregion

  // region emit
  // endregion

  // region lifecycle
  created() {
    $responseStore.fetchGetLogListAll(this.surveyId);
    console.log($responseStore.logList);
  }
  // endregion
}
</script>
