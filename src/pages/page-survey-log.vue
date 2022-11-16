<template>
  <DefaultLayout>
    <div class="breadcrumb">
      <router-link :to="{ path: '/' }">설문 목록</router-link>
      <span> > </span>
      <router-link :to="{ path: `/log/${surveyId}` }">{{survey.surveyName}} 로그</router-link>
    </div>
    <div class="survey-log">
      <div class="survey-log__body" v-show="isResponseListEmpty">
        <div class="survey-log--noContent">
          <p>제출된 응답이 없습니다.</p>
        </div>
      </div>
      <div class="survey-log__body" v-show="!isResponseListEmpty">
        <table class="table">
          <thead class="table__thead">
          <tr class="table__tr">
            <th>참여자 (응답내용 확인하기)</th>
            <th>참여 시간</th>
          </tr>
          </thead>
          <tbody class="table__tbody">
          <tr class="table__tr"
              :key="index"
              v-for="(response, index) in responseList"
          >
            <td><router-link :to="{ name: PageRouteNames.surveyLogDetail, params: { surveyId: response.surveyId, userName: response.userName }}">{{response.userName}}</router-link></td>
            <td>{{ response.createdAt }}</td>
          </tr>
          </tbody>
        </table>
        <el-pagination layout="prev, pager, next"
                       :page-size="perPage"
                       :total="total"
                       @current-change="handleChangeCurrentPage">
        </el-pagination>
      </div>
    </div>
  </DefaultLayout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { $responseStore, $surveyStore } from '@/store';
import { PageRouteNames } from '@/enum/page-names';
import DefaultLayout from '@/layouts/default-layout.vue';

@Component({ components: { DefaultLayout } })
export default class PageSurveyLog extends Vue {
  // region data
  PageRouteNames = PageRouteNames
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  get survey() {
    return $surveyStore.survey;
  }

  get responseList() {
    return $responseStore.logList.data;
  }
  get isResponseListEmpty() {
    return $responseStore.logList.data.length === 0;
  }

  get perPage() {
    return $responseStore.logList.perPage;
  }

  get total() {
    return $responseStore.logList.total;
  }
  // endregion

  // region method
  async handleChangeCurrentPage(page: number) {
    await $responseStore.fetchGetLogList({ page, surveyId: this.surveyId });
  }
  // endregion

  // region lifecycle
  async created() {
    await $surveyStore.fetchGetSurvey(this.surveyId);
  }

  async mounted() {
    await $responseStore.fetchGetLogList({ page: 1, surveyId: this.surveyId });
  }
  // endregion
}
</script>
