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
import { Vue, Component, Watch } from 'vue-property-decorator';
import AtomicInput from '@/components/sign-in/atomic-input.vue';
import SurveyTitle from '@/components/survey-response-and-log/survey-title.vue';
import QuestionList from '@/components/survey-response-and-log/question-list.vue';
import { $responseStore, $surveyStore } from '@/store';
import { UTILS } from '@/utils/index';
import { deleteCookie, getCookie, setCookie } from '@/utils/cookie';
import router from '@/router';

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
    // userCheck 로직 추가
    await $responseStore.fetchUserCheck({ userName: this.userName, surveyId: this.surveyId })
      .then((result) => {
        if(result === 'new_user') {
          setCookie('checkedUserName', this.userName);
          $responseStore.fetchSetResponseItem({ userName: this.userName, surveyId: this.surveyId });
          router.push( { name: '설문 웅답' });
        }
        else if(result === 'already_response') {
          this.$message({
            showClose: true,
            message: '이미 참여한 설문은 다시 참여할 수 없어요! 다른 설문에 참여해주세요.',
            type: 'error'
          });
        }
      })
      .catch((error) => this.openModal(`${error}`, '오류'));
  }


  openModal(message: string, title: string) {
    this.$alert(message, title, {
      confirmButtonText: 'OK',
    });
  }
  // endregion

  // region lifecycle
  // endregion
}
</script>
