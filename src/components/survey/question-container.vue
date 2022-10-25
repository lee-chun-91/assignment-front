<template>
  <div class="question">
    <input type="text" className="question__input"  placeholder="질문내용을 입력해주세요"
           name="questionName" :value="questionName"/>
    <select name="questionType" :value="questionType">
      <option value="Yes/No" selected>YES/NO</option>
      <option value="Yes/No">단일선택</option>
      <option value="Yes/No">다중선택</option>
    </select>
    <answer-list :questionId="questionId" :type="questionType" :answerList="answerList"></answer-list>
  </div>
</template>

<script lang="ts">

import AnswerList from '@/components/survey/answer-list.vue';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: { AnswerList }
})
export default class QuestionContainer extends Vue {
  // region prop
  @Prop( { type: String }) questionId!: string
  @Prop( { type: String }) questionName!: string
  @Prop( { type: Number }) questionType!: number
  @Prop( { type: Array }) answerList!: object
  // endregion

  // region local
  // endregion

  // region computed
  // getInput() {
  //   return null;
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
