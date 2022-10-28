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
import { $surveyStore } from '@/store';

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

  userCheck() {
    // userCheck 로직 추가
    this.checkedUser = true;
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
