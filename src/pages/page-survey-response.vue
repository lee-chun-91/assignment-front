<template>
  <div class="survey-response">
    <div class="container container--response" v-loading.fullscreen.lock="fullscreenLoading">
      <div class="container--response__wrapper">
        <survey-title :user-name="checkedUserName"></survey-title>
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
import { deleteCookie, getCookie } from '@/utils/cookie';
import { NoticeMessage } from '@/enum/notice-message';
import { PageNames } from '@/enum/page-names';

@Component({ components: { AtomicInput, QuestionList, SurveyTitle  } })
export default class PageSurveyResponse extends Vue {
  // region local
  fullscreenLoading= true;
  // endregion

  // region computed
  get surveyId() {
    return this.$route.params.surveyId;
  }

  get checkedUserName() {
    return getCookie('checkedUserName');
  }
  // endregion

  // region watch
  // endregion


  // region method
  saveResponse() {
    const convertedDate = UTILS.convertDate(new Date());
    $responseStore.fetchSaveResponse(convertedDate)
      .then(() => this.openModal(NoticeMessage.successSaveResponse, '완료'))
      .catch((error) => this.openModal(`${error}`, '오류'));
  }

  openModal(message: string, title: string) {
    if (title === '완료') {
      this.$alert(message, title, {
        confirmButtonText: '다른 응답 제출',
        callback: () => {
          // cookie 의 응답 유저 정보 삭제
          deleteCookie('checkedUserName');
          this.$router.push( { name: PageNames.userCheck, params: { surveyId: this.surveyId } });
        }
      });
    }
    else if (title === '오류') {
      this.$alert(message, title, {
        confirmButtonText: 'OK',
      });
    }
  }

  // endregion

  // region lifecycle
  // async beforeCreate() {
  //   console.log('beforeCreate start');
  //   console.log('checkedUserName in componenet', this.userName);
  //   console.log('checkedUserName in cookie', this.checkedUserName);
  //   console.log('isCheckedUser', this.isCheckedUser);
  //   console.log($surveyStore.survey);
  //   console.log('beforeCreate end');
  //   console.log('-----------------');
  // }

  async created() {

    // const loading = this.$loading({
    //   lock: true,
    //   text: 'Loading',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // });
    // console.log('created start');
    // console.log('isCheckedUser', this.isCheckedUser);
    // console.log('this.loading', this.loading);
    await $surveyStore.fetchGetSurvey(this.surveyId)
      .then(() => {
        this.fullscreenLoading = false;
        // loading.close()
      });
    // console.log('this.loading', this.loading);
    // $responseStore.fetchSetResponseItem({ userName: this.checkedUserName, surveyId: this.surveyId });
    // console.log($surveyStore.survey);
    // console.log('created end');
    // console.log('-----------------');
  }

  // beforeMount() {
  //   console.log('beforeMount start');
  //   console.log('checkedUserName in componenet', this.userName);
  //   console.log('checkedUserName in cookie', this.checkedUserName);
  //   console.log('isCheckedUser', this.isCheckedUser);
  //   console.log($surveyStore.survey);
  //   console.log('beforeMount end');
  //   console.log('-----------------');
  // }

  mounted() {
    console.log('mounted start');
    console.log('checkedUserName in cookie', this.checkedUserName);
    console.log($surveyStore.survey);
    console.log('mounted end');
    console.log('-----------------');
  }

  // beforeUpdate() {
  //   console.log('userName beforeUpdate', this.userName);
  //   console.log('isCheckedUser beforeUpdate', this.isCheckedUser);
  //   console.log('componentKey beforeUpdate', this.componentKey);
  //   console.log('-----------------');
  // }


  beforeDestroy() {
    console.log('beforeDestroy');
    console.log('-----------------');
  }

  destroyed() {
    console.log('destroyed');
  }
  // endregion
}
</script>
