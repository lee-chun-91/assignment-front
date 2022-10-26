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
    >
      <transition-group type="transition" :name="!dragging ? 'flip-list' : null">
        <div class="question-list-item" v-for="{ question_id } in questionList" :key="question_id">
          <i class="el-icon-rank handle"></i>
          <question :questionId="question_id"></question>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import draggable, { MoveEvent } from 'vuedraggable';
import { $surveyStore } from '@/store';
import Question from '@/components/survey-create/question.vue';

@Component({ components: { draggable, Question } })
export default class QuestionList extends Vue {
  // region local
  enabled = true
  dragging= false
  // endregion

  // region computed
  get questionList() {
    return $surveyStore.survey.question_list;
    // return $surveyStore.survey.question_list.map((question) => {
    //   return question;
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
