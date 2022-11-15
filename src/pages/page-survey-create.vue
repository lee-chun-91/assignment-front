<template>
  <DefaultLayout>
    <div class="breadcrumb">
      <router-link :to="{ path: '/' }">설문 목록</router-link>
      <span> > </span>
      <router-link :to="{ path: '/create' }">설문 생성</router-link>
    </div>
    <div class="survey-create">
      <el-form :model="survey" :rules="rules" ref="surveyForm">
        <survey-title :survey="survey"></survey-title>
        <question-list :survey="survey"></question-list>
      </el-form>
      <div class="button-group">
        <el-button class="button-group__button button-group__button--add"
                   type="primary"
                   icon="el-icon-plus"
                   round
                   @click="addQuestion"
        >
          질문 추가
        </el-button>
        <el-button class="button-group__button button-group__button--save"
                   type="success"
                   icon="el-icon-check"
                   round
                   @click="saveSurvey('survey')"
        >
          설문지 저장하기
        </el-button>
      </div>
    </div>
  </DefaultLayout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import DefaultLayout from '@/layouts/default-layout.vue';
import SurveyTitle from '@/components/survey-create-and-update/survey-title.vue';
import QuestionList from '@/components/survey-create-and-update/question-list.vue';
import { $surveyStore } from '@/store';
import { NoticeMessages } from '@/enum/notice-messages';

@Component({
  components: {
    DefaultLayout,
    SurveyTitle,
    QuestionList,
  }
})
export default class PageSurveyCreate extends Vue {
  // region local
  rules = {
    surveyName: { required: true, message: '설문명을 입력해주세요', trigger: 'blur' },
    // questionList: {
    //   type: 'array',
    //   required: true,
    //   defaultField: {
    //     type: 'object',
    //     required: true,
    //     fields: {
    //       questionName: { required: true, message: '질문을 입력해주세요', trigger: 'blur' },
    //       answerOptionList: {
    //         type: 'array',
    //         required: true,
    //         defaultField: {
    //           type: 'object',
    //           fields: {
    //             text: { required: true, message: '답변 옵션을 입력해주세요', trigger: 'blur' },
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }
  // endregion

  get survey() {
    return $surveyStore.survey;
  }
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
      }))
      .catch((error) => this.$message({
        showClose: true,
        message: error,
        type: 'error'
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
