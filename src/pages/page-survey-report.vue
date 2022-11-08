<template>
  <div class="survey-report">
    <div class="survey-report__count">
      <report-count title="총 참여자" :count="totalLogCount"></report-count>
      <report-count title="오늘 참여자" :count="todayLogCount"></report-count>
    </div>
    <div class="survey-report__result" v-if="isEmpty">
      <div class="survey-report--noContent">
        <p>제출된 응답이 없습니다.</p>
      </div>
    </div>
    <div class="survey-report__result" v-else>
      <div v-for="reportData in reportData" :key="reportData.questionId">
        <question-report
          :question-name="reportData.questionName"
          :questionId="reportData.questionId"
          :reportType="reportData.reportType"
          :chartData="reportData.chartData"
          :datasets="reportData.chartData.datasets"
          @update-report-type="updateReportType">
        </question-report>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { $responseStore, $surveyStore } from '@/store';
import ReportCount from '@/components/survey-report/report-count.vue';
import QuestionReport from '@/components/survey-report/question-report.vue';
import { UTILS } from '@/utils/index';

export interface IReportDataItem {
  questionName: string;
  questionId: string;
  reportType: number;
  chartData: IChartData;
}

export interface IChartData {
  labels: string[];
  datasets: IDatasets[]
}

export interface IDatasets {
  label: string;
  backgroundColor: string[];
  data: number[]
}

@Component({
  components: { QuestionReport, ReportCount }
})
export default class PageSurveyReport extends Vue {
  // region local
  totalLogCount = 0
  todayLogCount = 0
  reportData: IReportDataItem[] = []
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  get survey() {
    return $surveyStore.surveyList.data.filter((survey) => survey._id === this.surveyId);
  }

  get isEmpty() {
    return $responseStore.logList.data.length === 0;
  }
  // endregion

  // region method
  updateReportType({ questionId, value }: {questionId: string, value: number}) {
    const foundIndex = this.reportData.findIndex((reportData) => reportData.questionId === questionId);
    this.reportData[foundIndex].reportType = value;
  }
  // endregion

  // region lifecycle
  async created() {
    // 1. logList, survey data get
    await $responseStore.fetchGetLogListAll(this.surveyId);
    await $surveyStore.fetchGetSurvey(this.surveyId);

    // 2. reportData 만들기
    // 2.1. survey 의 질문별 응답값과 응답값별 빈도를 산출하기 위해 반복문을 돌린다
    $surveyStore.survey.questionList.forEach((question) => {
      const qName = question.questionName;
      const qId = question.questionId;
      let answerArray: string[] = [];
      const logList = $responseStore.logList.data;

      // 2.2. logList 에서 질문에 대한 응답을 찾고, 그 값들을 answerArray 에 모은다
      logList.forEach((log) => {
        const foundIndex = log.answerList.findIndex(item =>
          item.questionId === qId);
        if (foundIndex < 0) {
          return;
        }
        else {
          const answer = log.answerList[foundIndex].answer;
          answer.forEach((answer) => answerArray.push(answer.text));
        }
      });

      // 2.3. 데이터별 빈도를 산출한다.
      const elementCount = UTILS.getElementCount(answerArray);

      // 2.4. initial chartData를 선언하고,
      let chartData: IChartData = {
        labels: [],
        datasets: [{ label: '', backgroundColor: [], data: [] }]
      };

      // 2.5. chartData 에 값을 넣는다.
      for (let [answer, count] of Object.entries(elementCount)) {
        chartData.labels.push(answer);
        chartData.datasets[0].backgroundColor.push(UTILS.getRandomColor());
        chartData.datasets[0].data.push(count);
      }

      // 2.6. reportData 값을 만든다.
      let reportDataItem: IReportDataItem = {
        questionName: qName,
        questionId: qId,
        reportType: 0,
        chartData,
      };

      // 2.7. 만든 reportData 를 totalData 에 push 한다.
      this.reportData.push(reportDataItem);
    });

    // 2. totalLogCount 구하기
    this.totalLogCount = $responseStore.logList.data.length;

    // 3. todayLogCount count 구하기
    const today = new Date();
    this.todayLogCount = $responseStore.logList.data.filter((i) => {
      return UTILS.isSameDate(today, new Date(`${i.createdAt}`));}).length;
  }
  // endregion
}
</script>
