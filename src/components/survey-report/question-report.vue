<template>
  <div class="question-report">
    <div class="question-report__header">
      <h3>질문. {{questionName}}</h3>
      <el-select :value="reportType" @change="handleUpdateReportType($event)">
        <el-option label="파이차트" :value="0"></el-option>
        <el-option label="컬럼차트" :value="1"></el-option>
        <el-option label="테이블" :value="2"></el-option>
      </el-select>
    </div>
    <div class="question-report__body">
      <div class="question-report__noResponse" v-if="hasNoQuestionResponse">문항에 대한 응답이 없습니다.</div>

      <div class="question-report__response" v-else>
        <div v-if="isPieChart">
          <Doughnut :chartData="this.chartData"></Doughnut>
        </div>
        <div v-else-if="isColumnChart">
          <Bar :chart-data="this.chartData"
               :chart-options="this.chartOptions"
               chart-id="bar-chart"
               datasetIdKey="label">
          </Bar>
        </div>
        <div class="question-report__table" v-else-if="isTableChart">
          <table class="table">
            <thead class="table__thead">
            <tr class="table__tr">
              <th>항목 이름</th>
              <th>응답자 수</th>
              <th>응답 비율</th>
            </tr>
            </thead>
            <tbody class="table__tbody">
            <tr class="table__tr" v-for="(item, index) in chartData.labels" :key="index">
              <td>{{item}}</td>
              <td>{{datasets[0].data[index]}}</td>
              <td>{{responseRatio(index)}} %</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { Pie, Doughnut, Bar } from 'vue-chartjs/legacy';
import { Chart as ChartJS, registerables  } from 'chart.js';
import { IChartData, IDatasets } from '@/pages/page-survey-report.vue';

ChartJS.register(...registerables);

@Component({
  components: { Pie, Doughnut, Bar }
})
export default class QuestionReport extends Vue {
  // region prop
  @Prop( { type: String, required: true }) questionName!: string
  @Prop({ type: String, required: true }) questionId!: string
  @Prop({ type: Number, required: true }) reportType!: number
  @Prop({ type: Object as () => IChartData, required: true }) chartData!: IChartData
  @Prop( { type: Array as () => IDatasets[], required: true }) datasets!: IDatasets[]

  // endregion

  // region local
  chartOptions = {
    plugins: {
      legend: {
        display: false
      }
    }
  }
  // endregion

  // region computed
  get hasNoQuestionResponse() {
    return this.chartData.labels.length === 0;
  }

  get isPieChart() {
    return this.reportType === 0;
  }
  //
  get isColumnChart() {
    return this.reportType === 1;
  }

  get isTableChart() {
    return this.reportType === 2;
  }

  get questionResponseCount() {
    return this.datasets[0].data.reduce((acc, cur) => acc+cur);
  }
  // endregion

  // region method
  responseRatio(index: number) {
    return Math.round((this.datasets[0].data[index]/this.questionResponseCount) * 100);
  }
  // endregion

  // region emit
  @Emit()
  handleUpdateReportType(reportType: number) {
    return { questionId: this.questionId, reportType };
  }
  // endregion
}
</script>
