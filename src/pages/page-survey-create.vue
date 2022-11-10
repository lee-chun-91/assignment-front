<template>
  <div class="survey-create">
    <survey-title></survey-title>
    <question-list></question-list>
    <div class="button-group">
      <el-button class="button-group__button button-group__button--add" type="primary" round @click="addQuestion">+ 질문 추가</el-button>
      <el-button class="button-group__button button-group__button--save" type="success" icon="el-icon-check" round @click="saveSurvey">설문지 저장하기</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SurveyTitle from '@/components/survey-create-and-update/survey-title.vue';
import QuestionList from '@/components/survey-create-and-update/question-list.vue';
import { $surveyStore } from '@/store';
import { NoticeMessages } from '@/enum/notice-messages';

@Component({
  components: {
    SurveyTitle,
    QuestionList,
  }
})
export default class PageSurveyCreate extends Vue {
  // region method
  addQuestion() {
    $surveyStore.fetchAddQuestion();
  }

  saveSurvey() {
    $surveyStore.fetchSaveSurvey()
      .then(() => this.$alert(NoticeMessages.successSaveSurvey, '안내', {
        confirmButtonText: 'OK',
        callback: () => {
          this.$router.push('/');}
      }));
  }
  // endregion

  // region lifecycle
  destroyed() {
    $surveyStore.fetchInitSurveyState();
  }
  // endregion
}
</script>
