<template>
  <div class="survey-log-detail">
    <survey-title></survey-title>
    <question-list></question-list>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import SurveyTitle from '@/components/survey-response/survey-title.vue';
import QuestionList from '@/components/survey-response/question-list.vue';
import AtomicInput from '@/components/sign-in/atomic-input.vue';

@Component({ components: { QuestionList, SurveyTitle  } })
export default class PageSurveyLogDetail extends Vue {
  // region prop
  // endregion

  // region local
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
