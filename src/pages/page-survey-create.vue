<template>
  <div class="survey-create">
    <survey-head></survey-head>
    <question-list></question-list>
  </div>
</template>

<script lang="ts">
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
