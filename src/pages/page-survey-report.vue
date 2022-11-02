<template>
  <div class="survey-report">
    <div class="survey-report__count">
      <report-count title="총 참여자" :count="totalLog"></report-count>
      <report-count title="오늘 참여자" :count="todayLog"></report-count>
    </div>
    <div class="survey-report__result" v-if="isEmpty">
      <div>아직 응답이 없습니다.</div>
    </div>
    <div class="survey-report__result" v-else>
      <div v-for="reportData in totalData" :key="reportData.questionId">
        <question-report
                         :question-name="reportData.questionName"
                         :questionId="reportData.questionId"
                         :reportType="reportData.reportType"
                         :chartData="reportData.chartData"
                         :datasets="reportData.chartData.datasets"
                         @update-report-type="updateReportType"
        >
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

export interface IQuestionData {
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
  // region prop
  // endregion

  // region local
  totalLog = 0
  todayLog = 0
  totalData: IQuestionData[] = []
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
    const foundIndex = this.totalData.findIndex((item) => item.questionId === questionId);
    this.totalData[foundIndex].reportType = value;
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  async created() {
    await $responseStore.fetchGetLogListAll(this.surveyId);
    await $surveyStore.fetchGetSurvey(this.surveyId);

    // 1. report Data 만들기
    // survey 의 질문별로 응답값을 모으고, 값별 빈도를 산출해야 한다.
    $surveyStore.survey.questionList.map((q) => {
      const qName = q.questionName;
      const qId = q.questionId;
      let answerArray: string[] = [];
      const logList = $responseStore.logList.data;

      console.log('loglist', logList);
      // logList 에서 질문에 대한 응답을 찾고, 그 값들을 answerArray 에 모은다
      logList.map((log) => {
        const foundIndex = log.questionAnswer.findIndex(item =>
          item.questionId === qId);
        if (foundIndex < 0) {
          return;
        }
        else {
          const data = log.questionAnswer[foundIndex].answer;
          answerArray.push(...data);
        }
      });

      // 데이터별 빈도 산출
      const elementCount = UTILS.getElementCount(answerArray);
      console.log('elementCount', elementCount);

      // initial chartData
      let chartData: IChartData = {
        labels: [],
        datasets: [{ label: '', backgroundColor: [], data: [] }]
      };

      // chartData 에 값 넣기
      for (let [answer, count] of Object.entries(elementCount)) {
        chartData.labels.push(answer);
        chartData.datasets[0].backgroundColor.push(UTILS.getRandomColor());
        chartData.datasets[0].data.push(count);
      }

      // questionData 값 만들기
      let questionData: IQuestionData = {
        questionName: qName,
        questionId: qId,
        reportType: 0,
        chartData,
      };

      // 만든 questionData 를 state 에 push
      this.totalData.push(questionData);
    });

    // 2. totalLog 구하기
    this.totalLog = $responseStore.logList.data.length;
    console.log($responseStore.logList);

    // 3. todayLog count 구하기
    const today = new Date();
    this.todayLog = $responseStore.logList.data.filter((i) => {
      console.log(UTILS.isSameDate(today, new Date(`${i.createdAt}`)));
      return UTILS.isSameDate(today, new Date(`${i.createdAt}`));}).length;

    console.log('this.totalData', this.totalData);
  }

  // endregion
}
</script>
