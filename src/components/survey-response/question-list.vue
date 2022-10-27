<template>
  <div class="question-list">
    <div class="question-list-item" v-for="{ question_id, question_name, answer_option_list } in questionList" :key="question_id">
      <div>{{question_name}}</div>
      <answer-option-list :answerOptionList="answer_option_list" :questionId="question_id"></answer-option-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { $surveyStore } from '@/store';
import AnswerOptionList from '@/components/survey-response/answer-option-list.vue';

@Component({
  components: { AnswerOptionList }
})
export default class QuestionList extends Vue {
  // region local
  // endregion

  // region computed
  get questionList() {
    return $surveyStore.survey.question_list;
  }
  // endregion

  // region method
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
