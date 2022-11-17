<template>
  <DefaultLayout>
      <div class="breadcrumb">
        <router-link :to="{ path: '/' }">설문 목록</router-link>
        <span> > </span>
        <router-link :to="{ path: `/report/${surveyId}` }">{{survey.surveyName}} 리포트</router-link>
      </div>
      <div class="survey-report" v-if="fullscreenLoading" v-loading="fullscreenLoading"></div>
      <div class="survey-report" v-else>
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
              @handle-update-report-type="updateReportType">
            </question-report>
          </div>
        </div>
      </div>

  </DefaultLayout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { $surveyStore } from '@/store';
import ReportCount from '@/components/survey-report/report-count.vue';
import QuestionReport from '@/components/survey-report/question-report.vue';
import { UTILS } from '@/utils/index';
import _ from 'lodash';
import { ILogList, IQuestionResponse, IResponse } from '@/store/modules/module-response';
import { IAnswerOption } from '@/store/modules/module-survey';
import { responseApi } from '@/apis/reponseApi';
import DefaultLayout from '@/layouts/default-layout.vue';


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
  components: { DefaultLayout, QuestionReport, ReportCount }
})
export default class PageSurveyReport extends Vue {
  // region local
  totalLogCount = 0
  todayLogCount = 0
  // logList
  logList: ILogList = {
    total: 0,
    perPage: 0,
    data: []
  }
  surveyReportData: IReportDataItem[] = []
  fullscreenLoading = true
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  get survey() {
    return $surveyStore.survey;
  }

  get isEmpty() {
    return this.logList.data.length === 0;
  }
  // endregion

  // region method
  updateReportType({ questionId, reportType }: {questionId: string, reportType: number}) {
    _.forEach(this.surveyReportData, (reportDataItem: IReportDataItem) => {
      if (reportDataItem.questionId === questionId) {
        reportDataItem.reportType = reportType;
        return false;
      }
    });
  }
  // endregion

  // region lifecycle

  async mounted() {
    // 1. logList, survey data get
    await $surveyStore.fetchGetSurvey(this.surveyId);

    await responseApi.getLogListAll(this.surveyId)
      .then((res) => {
        const data: IResponse[] = _.map(res.data.data, (backResponse) => {
          const questionResponseList: IQuestionResponse[] = _.map(backResponse.question_response_list,
            (backQuestionResponse) => {
              return {
                questionId: backQuestionResponse.question_id,
                oneChoiceAnswer: backQuestionResponse.one_choice_answer,
                multipleChoiceAnswerList: backQuestionResponse.multiple_choice_answer_List,
              };
            }
          );

          return {
            userName: backResponse.user_name,
            surveyId: backResponse.survey_id,
            createdAt: backResponse.created_at,
            questionResponseList
          };
        });
        const logList: ILogList = {
          total: res.data.total,
          perPage: res.data.per_page,
          data,
        };

        this.logList = logList;
      });
    // .catch((error) => { return Promise.reject(error); });


    // 2. reportData 만들기
    // 2.1. survey 의 질문별 응답값과 응답값별 빈도를 산출하기 위해 반복문을 돌린다

    _.forEach($surveyStore.survey.questionList, ((question) => {
      const qName = question.questionName;
      const qId = question.questionId;
      let sumAnswer: string[] = [];
      const logList = this.logList.data;

      // 2.2. logList 에서 질문에 대한 응답을 찾고, 그 값들을 answerArray 에 모은다
      // loop 를 3겹으로 쌓았다는 점에서 나쁜 알고리즘이라고 생각. 더 나은 방법을 찾자.
      _.forEach(logList, (log) => {
        _.forEach(log.questionResponseList, (questionResponse: IQuestionResponse) => {
          if(questionResponse.questionId === qId) {
            if (questionResponse.multipleChoiceAnswerList.length > 0) {
              _.forEach(questionResponse.multipleChoiceAnswerList, (answer: IAnswerOption) =>
                sumAnswer.push(answer.text));
            }
            else {
              sumAnswer.push(questionResponse.oneChoiceAnswer.text);
            }
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
    this.totalLogCount = this.logList.data.length;

    // 4. todayLogCount count 구하기
    const today = new Date();
    this.todayLogCount = this.logList.data.filter((i) => {
      return UTILS.isSameDate(today, new Date(`${i.createdAt}`));}).length;
  }

  updated() {
    this.fullscreenLoading = false;
  }
  // endregion
}
</script>
