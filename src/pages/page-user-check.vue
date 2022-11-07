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
import { setCookie } from '@/utils/cookie';
import { NoticeMessage } from '@/enum/notice-message';
import { PageNames } from '@/enum/page-names';

@Component({ components: { AtomicInput, QuestionList, SurveyTitle  } })
export default class PageUserCheck extends Vue {
  // region local
  userName = '';
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  // endregion

  // region watch
  // endregion


  // region method
  updateUsername(value: string) {
    this.userName = value;
  }

  async userCheck() {
    if (this.userName === '') {
      this.$message({
        showClose: true,
        message: NoticeMessage.emptyUserName,
        type: 'error'
      });
    }

    else {
      // userCheck 로직 추가
      await $responseStore.fetchUserCheck({ userName: this.userName, surveyId: this.surveyId })
        .then((result) => {
          if(result === 'new_user') {
            console.log(this.userName, this.surveyId);
            setCookie('checkedUserName', this.userName);
            $responseStore.fetchSetResponseItem({ userName: this.userName, surveyId: this.surveyId });
            this.$router.push( { name: PageNames.surveyResponse, params: { surveyId: this.surveyId, userName: this.userName } });
          }
          else if(result === 'already_response') {
            this.$message({
              showClose: true,
              message: NoticeMessage.alreadyResponse,
              type: 'error'
            });
          }
        })
        .catch((error) => this.openModal(`${error}`, '오류'));
    }


  }


  openModal(message: string, title: string) {
    this.$alert(message, title, {
      confirmButtonText: 'OK',
    });
  }
  // endregion

  // region lifecycle
  created() {
    console.log(this.$route);
    console.log(this.$router);
  }
  // endregion
}
</script>
