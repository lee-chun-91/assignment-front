<template>
  <div class="survey-update">
    <survey-title></survey-title>
    <question-list></question-list>
    <div class="btn-field">
      <el-button class="btn-field__button--add" type="primary" round @click="addQuestion">+ 질문 추가</el-button>
      <el-button class="btn-field__button--save" type="success" icon="el-icon-check" round @click="updateSurvey">설문지 수정하기</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SurveyTitle from '@/components/survey-create/survey-title.vue';
import QuestionList from '@/components/survey-create/question-list.vue';
import { $surveyStore } from '@/store';
import { ISurvey } from '@/store/modules/module-survey';

@Component({
  components: {
    SurveyTitle,
    QuestionList,
  }
})
export default class PageSurveyUpdate extends Vue {
  // region prop
  // endregion

  // region local
  // endregion

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
    console.log('surveyId', this.surveyId);
    const survey = $surveyStore.survey;
    $surveyStore.fetchUpdateSurvey({ surveyId: this.surveyId, survey })
      .then(() => this.openModal('설문지가 수정되었습니다'))
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
  async created() {
    // console.log('type of surveyId', typeof this.surveyId);
    await $surveyStore.fetchGetSurvey(this.surveyId);
    console.log('updateSurvey', $surveyStore.survey);

  }
  // endregion
}
</script>
