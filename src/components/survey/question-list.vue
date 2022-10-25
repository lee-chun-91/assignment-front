<template>
  <div class="question-list">
<!--  basic-->
    <draggable :questionList="questionList"
               :disabled="!enabled"
               class="question-list-draggable"
               ghost-class="ghost"
               :move="checkMove"
               @start="dragging = true"
               @end="dragging = false"
    >
      <div class="question-list-item" v-for="{ id } in questionList"
           :key="id">
        <question-container :questionId="id">
<!--                            :questionName="questionName"-->
<!--                            :answerType="answerType"-->
<!--                            :answerOptionList="answerOptionList">-->
        </question-container>
      </div>
    </draggable>
    <el-button type="primary" round @click="addQuestion">질문 추가</el-button>
  </div>
<!--  transition version-->

  <!--  <draggable class="question-list" tag="ul" v-model="questionList" v-bind="dragOptions" @start="drag = true"-->
  <!--             @end="drag = false">-->
  <!--    <transition-group type="transition" :name="!drag ? 'flip-list' : null">-->
  <!--      <li class="question-list-item"-->
  <!--          v-for="question in questionList" :key="question.id">-->
  <!--        <question-container :class="question.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'"-->
  <!--                            @click="question.fixed = !question.fixed"-->
  <!--                            aria-hidden="true">-->
  <!--        </question-container>-->
  <!--      </li>-->
  <!--    </transition-group>-->
  <!--  </draggable>-->
</template>vue chart.js


<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import draggable, { MoveEvent } from 'vuedraggable';
import { $surveyStore } from '@/store';
import QuestionContainer from '@/components/survey/question-container.vue';

@Component({ components: { draggable, QuestionContainer } })
export default class QuestionList extends Vue {
  // region prop
  // @Prop({ type: Array, required: true }) questionList!: question[];
  // endregion

  // region local
  enabled = true
  dragging = false
  // endregion

  // region computed
  get questionList() {
    return $surveyStore.survey.questionList.map((question) => {
      return question;
    });
  }
  // dragOptions() {
  //   return {
  //     animation: 200,
  //     group: 'description',
  //     disabled: false,
  //     ghostClass: 'ghost'
  //   };
  // }
  // endregion

  // region method
  checkMove(e : MoveEvent<number>) {
    window.console.log('Future index: ' + e.draggedContext.futureIndex);
  }

  addQuestion() {
    $surveyStore.fetchAddQuestion();
  }

  // endregion

  // region emit
  // endregion

  // region lifecycle
  created() {
    console.log($surveyStore.survey);
  }
  // endregion
}
</script>
