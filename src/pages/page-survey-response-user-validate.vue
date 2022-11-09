<template>
  <div class="survey-response">
    <div class="container container--userCheck">
      <h1 class="container__title">설문지 응답</h1>
      <AtomicInput class="container__input" title="username" placeholder="참여자 이름을 입력해주세요." :value="userName" @handle-input="updateUsername"></AtomicInput>
      <el-button class="container__button--userCheck" type="success" name="설문 시작" @click="userCheck">설문 시작</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AtomicInput from '@/components/sign-in/atomic-input.vue';
import SurveyTitle from '@/components/survey-response-and-log/survey-title.vue';
import QuestionList from '@/components/survey-response-and-log/question-list.vue';
import { $responseStore } from '@/store';
import { NoticeMessages } from '@/enum/notice-messages';
import { PageRouteNames } from '@/enum/page-names';

@Component({ components: { AtomicInput, QuestionList, SurveyTitle  } })
export default class PageSurveyResponseUserValidate extends Vue {
  // region local
  userName = '';
  from = '';
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }
  // endregion

  // region method
  updateUsername(value: string) {
    this.userName = value;
  }

  async userCheck() {
    if (this.userName === '') {
      this.$message({
        showClose: true,
        message: NoticeMessages.emptyUserNameField,
        type: 'error'
      });
    }

    else {
      // userCheck 로직 추가
      await $responseStore.fetchUserCheck({ userName: this.userName, surveyId: this.surveyId })
        .then((result) => {
          if(result.data.isChecked) {
            this.$router.push( { name: PageRouteNames.surveyResponse, params: { surveyId: this.surveyId, userName: this.userName } });
          }
        });
    }
  }
  // endregion
}
</script>
