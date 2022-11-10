<template>
  <div class="survey-update">
    <survey-title></survey-title>
    <question-list></question-list>
    <div class="button-group">
      <el-button class="button-group__button button-group__button--add" type="primary" round @click="addQuestion">+ 질문 추가</el-button>
      <el-button class="button-group__button button-group__button--save" type="success" icon="el-icon-check" round @click="updateSurvey">설문지 수정하기</el-button>
    </div>
  </div>
 </template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SurveyTitle from '@/components/survey-create-and-update/survey-title.vue';
import QuestionList from '@/components/survey-create-and-update/question-list.vue';
import { $surveyStore } from '@/store';
import { NoticeMessages } from '@/enum/notice-messages';

@Component({ components: { SurveyTitle, QuestionList } })
export default class PageSurveyUpdate extends Vue {
  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }
  // endregion

  // region method
  addQuestion() {
    $surveyStore.fetchAddQuestion();
  }

  updateSurvey() {
    $surveyStore.fetchUpdateSurvey(this.surveyId)
      .then(() => this.$alert(NoticeMessages.successUpdateSurvey, '안내', {
        confirmButtonText: 'OK',
        callback: () => {
          this.$router.push('/');}
      }))
      .catch((error) => this.$message({
        showClose: true,
        message: error,
        type: 'error'
      }));
  }
  // endregion

  // region lifecycle
  async created() {
    await $surveyStore.fetchGetSurvey(this.surveyId);
  }

  destroyed() {
    $surveyStore.fetchInitSurveyState();
  }
  // endregion
}
</script>
