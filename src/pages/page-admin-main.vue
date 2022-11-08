<template>
  <div class="admin-main">
    <div class="button">
      <router-link to="/create"><el-button plain class="button button--create">설문지 추가</el-button></router-link>
    </div>
    <div class="admin-main__body" v-show="isSurveyListEmpty">생성된 설문이 없습니다.</div>
    <div class="admin-main__body" v-show="!isSurveyListEmpty">
      <table class="table">
        <thead class="table__thead">
        <tr class="table__tr">
          <th>설문지 이름</th>
          <th>질문 갯수</th>
          <th>질문지 수정</th>
          <th>리포트</th>
          <th>로그</th>
          <th>설문지 배포</th>
        </tr>
        </thead>
        <tbody class="table__tbody">
        <tr class="table__tr"
            :key="index"
            v-for="(survey, index) in surveyList"
        >
          <td>{{ survey.surveyName }}</td>
          <td>{{ survey.questionList.length }}개</td>
          <td><router-link :to="{ name: PageRouteNames.surveyUpdate, params: { surveyId: survey._id }}">수정하러 가기</router-link></td>
          <td><router-link :to="{ name: PageRouteNames.surveyReport, params: { surveyId: survey._id }}">리포트 보기</router-link></td>
          <td><router-link :to="{ name: PageRouteNames.surveyLog, params: { surveyId: survey._id }}">로그 보기</router-link></td>
          <td><router-link :to="{ name: PageRouteNames.userCheck, params: { surveyId: survey._id }}">참여하러 가기</router-link></td>
        </tr>
        </tbody>
      </table>
      <el-pagination layout="prev, pager, next"
                     :page-size="perPage"
                     :total="total"
                     @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { $surveyStore } from '@/store';
import { PageRouteNames } from '@/enum/page-names';

@Component({})
export default class PageAdminMain extends Vue {
  // region data
  PageRouteNames = PageRouteNames
  // endregion
  // region computed
  get surveyList() {
    return $surveyStore.surveyList.data;
  }

  get isSurveyListEmpty() {
    return $surveyStore.surveyList.data.length === 0;
  }

  get total() {
    return $surveyStore.surveyList.total;
  }

  get perPage() {
    return $surveyStore.surveyList.perPage;
  }
  // endregion

  // region method
  async handleCurrentChange(page: number) {
    await $surveyStore.fetchGetSurveyList(page);
  }
  // endregion

  // region lifecycle
  async created() {
    await $surveyStore.fetchGetSurveyList(1);
  }
  // endregion
}
</script>
