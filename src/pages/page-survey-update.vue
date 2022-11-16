<template>
  <DefaultLayout>
    <div class="breadcrumb">
      <router-link :to="{ path: '/' }">설문 목록</router-link>
      <span> > </span>
      <router-link :to="{ path: `/update/${surveyId}` }">{{survey.surveyName}} 수정</router-link>
    </div>
    <div class="survey-update" v-if="fullscreenLoading" v-loading="fullscreenLoading"></div>
    <div class="survey-update" v-else>
      <el-form :model="survey" ref="surveyForm">
        <survey-title :survey="survey"></survey-title>
        <question-list :survey="survey"></question-list>
      </el-form>
      <div class="button-group">
        <el-button class="button-group__button button-group__button--add" type="primary" round @click="addQuestion">+ 질문 추가</el-button>
        <el-button class="button-group__button button-group__button--save" type="success" icon="el-icon-check" round @click="updateSurvey('surveyForm')">설문지 수정하기</el-button>
      </div>
    </div>
  </DefaultLayout>
 </template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SurveyTitle from '@/components/survey-create-and-update/survey-title.vue';
import QuestionList from '@/components/survey-create-and-update/question-list.vue';
import { $surveyStore } from '@/store';
import { NoticeMessages } from '@/enum/notice-messages';
import DefaultLayout from '@/layouts/default-layout.vue';
import { ElForm } from 'element-ui/types/form';

@Component({ components: { DefaultLayout, SurveyTitle, QuestionList } })
export default class PageSurveyUpdate extends Vue {
  // region local
  // rules = {
  //   surveyName: { required: true, message: '설문명을 입력해주세요', trigger: 'blur' },
  //   questionList: {
  //     type: 'array',
  //     required: true,
  //     fields: {
  //       type: 'object',
  //       required: true,
  //       defaultField: {
  //         questionId: { type:'string', required: true },
  //         questionName: [{ validator: this.validateQuestionName, trigger: 'blur' }],
  //         // questionName: { type:'string', required: true, message: '질문을 입력해주세요', trigger: 'blur' },
  //         answerType: { type: 'number', required: true },
  //         answerOptionList: {
  //           type: 'array',
  //           required: true,
  //           defaultField: {
  //             type: 'object',
  //             required: true,
  //             defaultField: {
  //               id: { type: 'string', required: true },
  //               text: [{ validator: this.validateAnswerOption, trigger: 'blur' }],
  //               // text: { type:'string', required: true, message: '답변 옵션을 입력해주세요', trigger: 'blur' },
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  fullscreenLoading = true
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  get survey() {
    return $surveyStore.survey;
  }
  // endregion

  // region method
  addQuestion() {
    $surveyStore.fetchAddQuestion();
  }

  updateSurvey(formName) {
    (this.$refs[formName] as ElForm).validate((valid) => {
      if (valid) {
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
      else {
        return this.$message({
          showClose: true,
          message: NoticeMessages.emptyInput,
          type: 'error'
        });
      }
    });
  }
  // endregion

  // region lifecycle
  async created() {
    await $surveyStore.fetchGetSurvey(this.surveyId);
  }

  updated() {
    this.fullscreenLoading = false;
  }

  beforeDestroy() {
    $surveyStore.fetchInitSurveyState();
  }
  // endregion
}
</script>
