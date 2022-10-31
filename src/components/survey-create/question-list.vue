<template>
  <div class="question-list">
    <draggable
               :questionList="questionList"
               class="question-list-draggable"
               handle=".handle"
               animation="200"
               group="description"
               :disabled="!enabled"
               ghost-class="ghost"
               @start="dragging = true"
               @end="dragging = false"
               v-model="questionList"
    >
      <transition-group type="transition" :name="!dragging ? 'flip-list' : null">
        <div class="question-list-item" v-for="{ questionId } in questionList" :key="questionId">
          <i class="el-icon-rank handle"></i>
          <question :questionId="questionId"></question>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import draggable, { MoveEvent } from 'vuedraggable';
import { $surveyStore } from '@/store';
import Question from '@/components/survey-create/question.vue';
import { IQuestion } from '@/store/modules/module-survey';

@Component({ components: { draggable, Question } })
export default class QuestionList extends Vue {
  // region local
  enabled = true
  dragging= false
  // endregion

  // region computed
  get questionList() {
    return $surveyStore.survey.questionList;
  }

  set questionList(questionList: IQuestion[]) {
    $surveyStore.fetchUpdateQuestionOrder(questionList);
  }
  // set questionList(value: any) {
  //   console.log(value);
  // }
  // endregion

  // region method
  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
