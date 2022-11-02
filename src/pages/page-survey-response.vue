<template>
  <div class="survey-response">
    <div class="grid grid--userCheck" v-if="!checkedUser">
      <h1 class="grid__title">설문지 응답</h1>
      <AtomicInput class="grid__input" title="username" placeholder="참여자 이름을 입력해주세요." :value="userName" @handle-input="updateUsername"></AtomicInput>
      <el-button class="gird__button--submit" type="success" name="설문 시작" @click="userCheck" round>설문 시작</el-button>
    </div>
    <div class="grid grid--response" v-else>
      <survey-title></survey-title>
      <question-list></question-list>
      <el-button class="btn-field__button--save" type="success" icon="el-icon-check" round @click="saveResponse">응답 제출하기</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AtomicInput from '@/components/common/atomic-input.vue';
import SurveyTitle from '@/components/survey-response-and-log/survey-title.vue';
import QuestionList from '@/components/survey-response-and-log/question-list.vue';
import { $responseStore, $surveyStore } from '@/store';
import { UTILS } from '@/utils/index';

@Component({ components: { AtomicInput, QuestionList, SurveyTitle  } })
export default class PageSurveyResponse extends Vue {
  // region prop
  // endregion

  // region local
  userName = '';
  checkedUser = false;
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
    // userCheck 로직 추가
    await $responseStore.fetchUserCheck({ userName: this.userName, surveyId: this.surveyId })
      .then((result) => {
        if(result === 'new_user') {
          this.checkedUser = true;
        }
        else if(result === 'already_response') {
          this.$alert('이미 참여한 설문은 다시 참여할 수 없어요! 다른 설문에 참여해주세요.', '안내', {
            confirmButtonText: 'OK',
          });
        }
      });
  }

  saveResponse() {
    const convertedDate = UTILS.convertDate(new Date());
    $responseStore.fetchSaveResponse(convertedDate)
      .then(() => this.openModal('응답이 제출되었습니다'))
      .catch((error) => this.openModal(`${error}`));
  }

  openModal(message: string) {
    this.$alert(message, '안내', {
      confirmButtonText: 'OK',
      callback: () => {
        this.$router.push('/');}
    });
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  async created() {
    await $surveyStore.fetchGetSurvey(this.surveyId);
    await $responseStore.fetchSetResponseItem({ userName: this.userName, surveyId: this.surveyId });
  }
  // endregion
}
</script>
