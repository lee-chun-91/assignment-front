<template>
  <div class="survey-log">
    <div class="admin-main-content" v-show="isResponseListEmpty">제출된 응답이 없습니다.</div>
    <div class="admin-main-content" v-show="!isResponseListEmpty">
      <table class="table">
        <thead class="table__thead">
        <tr class="table__tr">
          <th>참여자</th>
          <th>참여 시각</th>
        </tr>
        </thead>
        <tbody class="table__tbody">
        <tr class="table__tr"
            :key="index"
            v-for="(response, index) in responseList"
        >
          <td><router-link :to="{ name: 'surveyLogDetail', params: { surveyId: response.surveyId, userName: response.userName }}">{{response.userName}}</router-link></td>
          <td>{{ response.createdAt }}</td>
        </tr>
        </tbody>
      </table>
      <el-pagination layout="prev, pager, next"
                     :page-size="10"
                     :total="total"
                     @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import { $responseStore, $surveyStore } from '@/store';

@Component({})
export default class PageSurveyLog extends Vue {
  // region prop
  // endregion

  // region local
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  get responseList() {
    return $responseStore.logList.data;
  }
  get isResponseListEmpty() {
    return $responseStore.logList.data.length === 0;
  }

  get total() {
    return $responseStore.logList.total;
  }

  get perPage() {
    return $responseStore.logList.perPage;
  }
  // endregion

  // region method
  async handleCurrentChange(page: number) {
    console.log(`current page: ${page}`);
    await $responseStore.fetchGetLogList({ page, surveyId: this.surveyId });
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  async created() {
    await $responseStore.fetchGetLogList({ page: 1, surveyId: this.surveyId });
  }
  // endregion
}
</script>
