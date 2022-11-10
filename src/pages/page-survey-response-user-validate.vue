<template>
  <div class="survey-response">
    <div class="container container--userCheck">
      <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="100px">
        <h1 class="container__title">설문지 응답</h1>
        <el-form-item label="응답자 이름" prop="userName">
          <el-input :placeholder="NoticeMessages.emptyUserNameField" v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="container__button--userCheck" type="success" name="설문 시작" @click="userCheck('ruleForm')">설문 시작</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SurveyTitle from '@/components/survey-response-and-log/survey-title.vue';
import QuestionList from '@/components/survey-response-and-log/question-list.vue';
import { $adminStore, $responseStore } from '@/store';
import { NoticeMessages } from '@/enum/notice-messages';
import { PageRouteNames } from '@/enum/page-names';
import { ElForm } from 'element-ui/types/form';

@Component({ components: { QuestionList, SurveyTitle  } })
export default class PageSurveyResponseUserValidate extends Vue {
  // region local
  ruleForm = {
    userName: '',
  }

  rules = {
    userName: [
      { required: true, message: '응답자 이름을 입력해주세요', trigger: 'blur' },
      { min: 1, message: '최소 1자 이상 입력', trigger: 'blur' }
    ],
  }
  NoticeMessages = NoticeMessages
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }
  // endregion

  // region method
  async userCheck(formName) {
    (this.$refs[formName] as ElForm).validate((valid) => {
      if (valid) {
        $responseStore.fetchUserCheck({ userName: this.ruleForm.userName, surveyId: this.surveyId })
          .then((result) => {
            if(result.data.isChecked) {
              this.$router.push( { name: PageRouteNames.surveyResponse, params: { surveyId: this.surveyId, userName: this.ruleForm.userName } });
            }
          });
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }
  // endregion
}
</script>
