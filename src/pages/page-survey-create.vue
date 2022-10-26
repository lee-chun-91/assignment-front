<template>
  <div class="survey-create">
    <survey-head></survey-head>
    <question-list></question-list>
    <el-button type="primary" round @click="addQuestion">+ 질문 추가</el-button>
    <el-button type="success" icon="el-icon-check" round @click="saveSurvey">설문지 저장하기</el-button>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import SurveyHead from '@/components/survey/survey-head.vue';
import QuestionList from '@/components/survey/question-list.vue';
import { $surveyStore } from '@/store';

@Component({
  components: {
    SurveyHead,
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
    $surveyStore.fetchSaveSurvey();
    // 저장 성공여부에 따른 메시지 박스 show
    this.openModel();
  }

  openModel() {
    this.$alert('This is a message', 'Title', {
      confirmButtonText: 'OK',
      callback: action => {
        this.$router.push('/');
        // this.$message({
        //   type: 'info',
        //   message: `action: ${ action }`
        // });
      }
    });
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
