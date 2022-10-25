<template>
  <div class="answer-list">
    <div v-if="isRadioButton()">
      <div v-for="(item, index) in answerList" :key="index">
        <label :for="index">
          <input type="radio" :id="index" v-model="checked" value="item" name="answer"/>
          {{ item }}
        </label>
<!--        <el-radio v-model="checked" label="item">{{ item }}</el-radio>-->
      </div>
    </div>
    <div v-if="isCheckbox()">
      <div v-for="(item, index) in answerList" :key="index">
        <label for="item">
          <input type="checkbox" id="item" name="item" />
          {{ item }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import { QUESTION_TYPES } from '@/const/index';

@Component({})
export default class AnswerList extends Vue {
  // region prop
  @Prop( { type: String }) questionId!: string
  @Prop( { type: Number }) type!: number;
  @Prop( { type: Array }) answerList!: object;
  // endregion

  // region local
  checked = '';
  checkList = [];
  // endregion

  // region computed
  isRadioButton() {
    return this.type === QUESTION_TYPES.YES_NO || this.type === QUESTION_TYPES.ONE_CHOICE;
  }

  isCheckbox() {
    return this.type === QUESTION_TYPES.MULTIPLE_CHOICE;
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
