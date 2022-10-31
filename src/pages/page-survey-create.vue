<template>
  <div class="survey-create">
    <survey-title></survey-title>
    <question-list></question-list>
    <div class="btn-field">
      <el-button class="btn-field__button--add" type="primary" round @click="addQuestion">+ 질문 추가</el-button>
      <el-button class="btn-field__button--save" type="success" icon="el-icon-check" round @click="saveSurvey">설문지 저장하기</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SurveyTitle from '@/components/survey-create-and-update/survey-title.vue';
import QuestionList from '@/components/survey-create-and-update/question-list.vue';
import { $surveyStore } from '@/store';

@Component({
  components: {
    SurveyTitle,
    QuestionList,
  }
})
export default class PageSurveyCreate extends Vue {
  // region prop
  // endregion

  // region local
  // endregion

  // region computed
  // endregion

  // region method
  addQuestion() {
    $surveyStore.fetchAddQuestion();
  }

  saveSurvey() {
    $surveyStore.fetchSaveSurvey()
      .then(() => this.openModal('설문지가 저장되었습니다'))
      .catch((error) => this.openModal('error'));
  }

  openModal(message: string) {
    this.$alert(message, '안내', {
      confirmButtonText: 'OK',
      callback: action => {
        this.$router.push('/');}
    });
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  created() {
    $surveyStore.fetchSetInitialSurvey();
  }
  // endregion
}
</script>
