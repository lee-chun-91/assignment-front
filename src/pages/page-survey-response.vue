<template>
  <div class="survey-response">
    <div class="container container--userCheck" v-if="!isCheckedUser" :key="componentKey">
      <h1 class="container__title">설문지 응답</h1>
      <AtomicInput class="container__input" title="username" placeholder="참여자 이름을 입력해주세요." :value="userName" @handle-input="updateUsername"></AtomicInput>
      <el-button class="container__button--userCheck" type="success" name="설문 시작" @click="userCheck">설문 시작</el-button>
    </div>
    <div class="container container--response" v-else :key="componentKey">
      <div class="container--response__wrapper">
        <survey-title :user-name="checkedUserName"></survey-title>
        <question-list></question-list>
        <el-button class="container__button container__button--save" type="success" icon="el-icon-check" round @click="saveResponse">응답 제출하기</el-button>
      </div>
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

@Component({ components: { AtomicInput, QuestionList, SurveyTitle  } })
export default class PageSurveyResponse extends Vue {
  // region local
  userName = '';
  isCheckedUser = this.initIsCheckedUser();
  componentKey= 0;
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
  @Watch('isCheckedUser', { immediate: true, deep: true })
  public example() {
    console.log('watch example');
  }
  // endregion


  // region method
  initIsCheckedUser() {
    let stored = getCookie('checkedUserName');
    if (stored) {
      console.log('nothing checked. default is false');
      return false;
    } else {
      console.log('there is checked user');
      return true;
    }
  }

  updateUsername(value: string) {
    this.userName = value;
  }

  async userCheck() {
    // userCheck 로직 추가
    await $responseStore.fetchUserCheck({ userName: this.userName, surveyId: this.surveyId })
      .then((result) => {
        if(result === 'new_user') {
          setCookie('checkedUserName', this.userName);
          // this.forceRerender();
          this.initIsCheckedUser();
          // this.$forceUpdate();
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

  saveResponse() {
    const convertedDate = UTILS.convertDate(new Date());
    $responseStore.fetchSaveResponse(convertedDate)
      .then(() => this.openModal('응답이 제출되었습니다', '완료'))
      .catch((error) => this.openModal(`${error}`, '오류'));
  }

  openModal(message: string, title: string) {
    if (title === '완료') {
      this.$alert(message, title, {
        confirmButtonText: '다른 응답 제출',
        callback: () => {
          // // 유저 체크에 대한 값 지우기
          // this.checkedUser = false;
          // cookie 의 응답 유저 정보 삭제
          deleteCookie('checkedUserName');
          this.forceRerender();
        }
      });
    }
    else if (title === '오류') {
      this.$alert(message, title, {
        confirmButtonText: 'OK',
      });
    }
  }

  forceRerender() {
    this.componentKey += 1;
  }
  // endregion

  // region lifecycle
  async beforeCreate() {
    console.log('beforeCreate start');
    console.log('checkedUserName in componenet', this.userName);
    console.log('checkedUserName in cookie', this.checkedUserName);
    console.log('isCheckedUser', this.isCheckedUser);
    // await $surveyStore.fetchGetSurvey(this.surveyId);
    // await $responseStore.fetchSetResponseItem({ userName: this.userName, surveyId: this.surveyId });
    console.log($surveyStore.survey);
    console.log('beforeCreate end');
    console.log('-----------------');
  }

  async created() {
    console.log('created start');
    console.log('isCheckedUser', this.isCheckedUser);
    await $surveyStore.fetchGetSurvey(this.surveyId);
    await $responseStore.fetchSetResponseItem({ userName: this.userName, surveyId: this.surveyId });
    console.log($surveyStore.survey);
    console.log('created end');
    console.log('-----------------');
  }

  beforeMount() {
    console.log('beforeMount start');
    console.log('checkedUserName in componenet', this.userName);
    console.log('checkedUserName in cookie', this.checkedUserName);
    console.log('isCheckedUser', this.isCheckedUser);
    console.log($surveyStore.survey);
    console.log('beforeMount end');
    console.log('-----------------');
  }

  mounted() {
    console.log('mounted start');
    console.log('checkedUserName in componenet', this.userName);
    console.log('checkedUserName in cookie', this.checkedUserName);
    console.log('isCheckedUser', this.isCheckedUser);
    console.log($surveyStore.survey);
    console.log('mounted end');
    console.log('-----------------');
  }

  beforeUpdate() {
    console.log('userName beforeUpdate', this.userName);
    console.log('isCheckedUser beforeUpdate', this.isCheckedUser);
    console.log('componentKey beforeUpdate', this.componentKey);
    console.log('-----------------');
  }

  updated() {
    console.log('userName updated', this.userName);
    console.log('isCheckedUser updated', this.isCheckedUser);
    console.log('componentKey updated', this.componentKey);
    console.log('-----------------');
  }

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
