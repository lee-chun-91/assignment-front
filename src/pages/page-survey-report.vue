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
      <div v-for="reportDataItem in surveyReportData" :key="reportDataItem.questionId">
        <question-report
          :question-name="reportDataItem.questionName"
          :questionId="reportDataItem.questionId"
          :reportType="reportDataItem.reportType"
          :chartData="reportDataItem.chartData"
          :datasets="reportDataItem.chartData.datasets"
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
import _ from 'lodash';
import { IQuestionResponse } from '@/store/modules/module-response';
import { IAnswerOption } from '@/store/modules/module-survey';

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
  surveyReportData: IReportDataItem[] = []
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
    _.forEach(this.surveyReportData, (reportDataItem: IReportDataItem) => {
      if (reportDataItem.questionId === questionId) {
        reportDataItem.reportType = value;
        return false;
      }
    });
  }
  // endregion

  // region lifecycle
  async created() {
    // 1. logList, survey data get
    await $responseStore.fetchGetLogListAll(this.surveyId);
    await $surveyStore.fetchGetSurvey(this.surveyId);

    // 2. reportData 만들기
    // 2.1. survey 의 질문별 응답값과 응답값별 빈도를 산출하기 위해 반복문을 돌린다

    _.forEach($surveyStore.survey.questionList, ((question) => {
      const qName = question.questionName;
      const qId = question.questionId;
      let sumAnswer: string[] = [];
      const logList = $responseStore.logList.data;

      // 2.2. logList 에서 질문에 대한 응답을 찾고, 그 값들을 answerArray 에 모은다
      // loop 를 3겹으로 쌓았다는 점에서 나쁜 알고리즘이라고 생각. 더 나은 방법을 찾자.
      _.forEach(logList, (log) => {
        _.forEach(log.questionResponseList, (questionResponse: IQuestionResponse) => {
          if(questionResponse.questionId === qId) {
            _.forEach(questionResponse.choiceAnswerList, (answer: IAnswerOption) =>
              sumAnswer.push(answer.text));
            return false;
          }
        });
      });

      // 2.3. 데이터별 빈도를 산출한다.
      const countPerAnswer = UTILS.getElementCount(sumAnswer);

      // 2.4. initial chartData 를 선언하고,
      let chartData: IChartData = {
        labels: [],
        datasets: [{ label: '', backgroundColor: [], data: [] }]
      };

      // 2.5. chartData 에 값을 넣는다.
      for (let [answer, count] of Object.entries(countPerAnswer)) {
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
      this.surveyReportData.push(reportDataItem);
    }));


    // 3. totalLogCount 구하기
    this.totalLogCount = $responseStore.logList.data.length;

    // 4. todayLogCount count 구하기
    const today = new Date();
    this.todayLogCount = $responseStore.logList.data.filter((i) => {
      return UTILS.isSameDate(today, new Date(`${i.createdAt}`));}).length;
  }
  // endregion
}
</script>
