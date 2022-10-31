<template>
  <div class="survey-response">
    <div v-if="!checkedUser">
      <h1 class="sign-in-title">설문지 응답</h1>
      <AtomicInput title="username" placeholder="이름을 입력해주세요" :value="userName" @handle-input="updateUsername"></AtomicInput>
      <el-button type="success" name="설문 시작" @click="userCheck" round>설문 시작</el-button>
    </div>
    <div v-else>
      <survey-title></survey-title>
      <question-list></question-list>
      <el-button class="btn-field__button--save" type="success" icon="el-icon-check" round @click="saveResponse">응답 제출하기</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import AtomicInput from '@/components/sign-in/atomic-input.vue';
import SurveyTitle from '@/components/survey-response/survey-title.vue';
import QuestionList from '@/components/survey-response/question-list.vue';
import { $responseStore, $surveyStore } from '@/store';
import { convertDate } from '@/util/convertDate';

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
          this.$alert('이미 참여한 설문은 다시 참여할 수 없어요!', '안내', {
            confirmButtonText: 'OK',
          });
        }
      });
  }

  saveResponse() {
    const convertedDate = convertDate(new Date());
    $responseStore.fetchSaveResponse(convertedDate)
      .then(() => this.openModal('응답이 제출되었습니다'))
      .catch((error) => this.openModal('error'));
  }

  openModal(message: string) {
    this.$alert(message, '안내', {
      confirmButtonText: 'OK',
      callback: action => {
        this.$router.push('/');}
    });
  }
  // endregion

  // region emit
  // endregion

  // region lifecycle
  async created() {
    console.log(this.surveyId);
    await $surveyStore.fetchGetSurvey(this.surveyId);
    console.log($surveyStore.survey);
  }
  // endregion
}
</script>
