<template>
  <div class="survey-response">
    <div class="container container--response" v-loading.fullscreen.lock="fullscreenLoading">
      <div class="container--response__wrapper">
        <survey-title :user-name="userName"></survey-title>
        <question-list></question-list>
        <el-button class="container__button container__button--save" type="success" icon="el-icon-check" round @click="saveResponse">응답 제출하기</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AtomicInput from '@/components/sign-in/atomic-input.vue';
import SurveyTitle from '@/components/survey-response-and-log/survey-title.vue';
import QuestionList from '@/components/survey-response-and-log/question-list.vue';
import { $responseStore, $surveyStore } from '@/store';
import { UTILS } from '@/utils/index';
import { NoticeMessages } from '@/enum/notice-messages';
import { PageRouteNames } from '@/enum/page-names';

@Component({ components: { AtomicInput, QuestionList, SurveyTitle  } })
export default class PageSurveyResponse extends Vue {
  // region local
  fullscreenLoading = true
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  get userName() {
    return this.$route.params.userName;
  }
  // endregion

  // region method
  // beforeRouteUpdate
  // 컴포넌트 라우트 시 자동 실행된다고 한다. 그러나 여기서는 실행되지 않는 것으로 확인.
  // beforeRouteUpdate(to, from) {
  //   console.log(to, from);
  // }

  async userCheck() {
    await $responseStore.fetchUserCheck({ userName: this.userName, surveyId: this.surveyId })
      .then((result) => {
        if(result.isChecked) {
          return;
        }
        else if (!result.isChecked) {
          // this.$router.push( { name: PageRouteNames.surveyResponseUserValidate, params: { surveyId: this.surveyId } });
        }
      });
    // .catch((error) => this.openModal(`${error}`, '오류'));
  }

  openModal(message: string, title: string) {
    this.$alert(message, title, {
      confirmButtonText: 'OK',
    });
  }

  saveResponse() {
    const convertedDate = UTILS.convertDate(new Date());
    $responseStore.fetchSaveResponse(convertedDate)
      .then(() =>
        this.$alert(NoticeMessages.successSaveResponse, '완료', {
          confirmButtonText: '다른 응답 제출',
          callback: () => {
            this.$router.push( { name: PageRouteNames.surveyResponseUserValidate, params: { surveyId: this.surveyId } });
          }
        })
      )
      .catch((error) => this.$message({ showClose: true, message: error, type: 'error' }));
  }
  // endregion


  // region lifecycle
  async created() {
    await this.userCheck();
    await $surveyStore.fetchGetSurvey(this.surveyId)
      .then(() => {
        this.fullscreenLoading = false;
      });

    // params 가 변경된 것이지 라우팅이 변경된 게 아니기 때문에, $watch 로 변화를 비교할 수 있다.
    this.$watch(() => this.$route.params, (current, old) => {
      console.log(current, old);
      if (current.userName !== old.userName) {
        this.$router.push({ name: PageRouteNames.surveyResponseUserValidate });
      }
    });

  }

}
</script>
