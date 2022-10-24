<template>
  <div class="question">
    <input type="text" className="question__input"  placeholder="질문내용을 입력해주세요"
           name="questionName" />
    <select name="questionType">
      <option value="Yes/No" selected>YES/NO</option>
      <option value="Yes/No">단일선택</option>
      <option value="Yes/No">다중선택</option>
    </select>


  </div>
</template>

<script lang="ts">

import { uniqueId } from 'lodash';

import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';

@Component({})
export default class QuestionContainer extends Vue {
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
