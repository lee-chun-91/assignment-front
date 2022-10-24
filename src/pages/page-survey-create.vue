<template>
  <div class="survey-create">
    <survey-head></survey-head>
    <question-list :questionList="survey.questionList"></question-list>
  </div>
</template>

<script lang="ts">
export interface survey {
  surveyName: string;
  questionList: question[];
}

export interface question {
  id : string;
  questionName: string;
  questionType: string;
  answerList: string[];
}

import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import SurveyHead from '@/components/survey/survey-head.vue';
import QuestionList from '@/components/survey/question-list.vue';

@Component({
  components: {
    SurveyHead,
    QuestionList,
  }
})
export default class PageSurveyCreate extends Vue {
  // region prop
  // endregion

  // region local
  survey = {
    surveyName: '',
    questionList: [
      { id: '',
        questionName: '',
        questionType: '',
        answerList: [''],
      }
    ],
  }
  // endregion

  // region computed
  // endregion

  // region method
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
