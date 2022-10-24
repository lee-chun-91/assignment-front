<template>
  <draggable class="question-list" tag="ul" v-model="questionList" v-bind="dragOptions" @start="drag = true"
             @end="drag = false">
    <transition-group type="transition" :name="!drag ? 'flip-list' : null">
      <li class="question-list-item"
          v-for="question in questionList" :key="question.id">
        <question-container :class="question.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'"
                            @click="question.fixed = !question.fixed"
                            aria-hidden="true">
        </question-container>
      </li>
    </transition-group>
  </draggable>
</template>


<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import draggable from 'vuedraggable';
import { question } from '@/pages/page-survey-create.vue';
import QuestionContainer from '@/components/survey/question-container.vue';

@Component({ components: { draggable, QuestionContainer } })
export default class QuestionList extends Vue {
  // region prop
  @Prop({ type: Array, required: true }) questionList!: question[];
  // endregion

  // region local
  drag= false;
  // endregion

  // region computed
  dragOptions() {
    return {
      animation: 200,
      group: 'description',
      disabled: false,
      ghostClass: 'ghost'
    };
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
