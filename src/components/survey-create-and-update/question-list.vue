<template>
  <div class="question-list">
    <draggable
               :questionList="questionList"
               class="question-list__draggable"
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
        <div class="question" v-for="{ questionId, questionName } in questionList" :key="questionId">
          <i class="el-icon-rank handle"></i>
          <div class="question__title">
            <label for="질문내용"></label>
            <input class="question__input" type="text" id="질문내용"  placeholder="질문을 입력해주세요"
                   name="questionName" :value="questionName" @input="updateQuestionName(questionId, $event)"/>
            <select name="answerType" @change="updateAnswerType(questionId, $event)">
              <option value="0">YES/NO</option>
              <option value="1">단일선택</option>
              <option value="2">다중선택</option>
            </select>
          </div>
          <answer-option-list :questionId="questionId"></answer-option-list>
          <div class="question__footer">
            <el-button square size="mini" @click="addAnswerOption(questionId)">+ 답변 옵션 추가</el-button>
<!--            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteQuestion(questionId)"></el-button>-->
            <el-button size="mini" @click="deleteQuestion(questionId)"> - 질문 삭제 </el-button>
          </div>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import { $surveyStore } from '@/store';
import AnswerOptionList from '@/components/survey-create-and-update/answer-option-list.vue';
import { IQuestion } from '@/store/modules/module-survey';

@Component({ components: { draggable, AnswerOptionList } })
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

  // get questionName() {
  //   const foundIndex = $surveyStore.survey.questionList.findIndex((i) => i.questionId === this.questionId);
  //   return $surveyStore.survey.questionList[foundIndex].questionName;
  // }
  //
  // get answerType() {
  //   const foundIndex = $surveyStore.survey.questionList.findIndex((i) => i.questionId === this.questionId);
  //   return $surveyStore.survey.questionList[foundIndex].answerType;
  // }
  // set questionList(value: any) {
  //   console.log(value);
  // }
  // endregion

  // region method
  updateQuestionName(questionId: string, e: InputEvent) {
    if (!e.target) {
      return;
    }
    const eventTarget = e.target as HTMLInputElement;
    const questionName = eventTarget.value;
    $surveyStore.fetchUpdateQuestionName({ questionId, questionName });
  }

  updateAnswerType(questionId: string, e: Event) {
    if (!e.target) {
      return;
    }
    const eventTarget = e.target as HTMLSelectElement;
    const answerType = Number(eventTarget.value);
    $surveyStore.fetchUpdateAnswerType({ questionId, answerType });
  }

  addAnswerOption(questionId: string) {
    $surveyStore.fetchAddAnswerOption(questionId);
  }

  deleteQuestion(questionId: string) {
    $surveyStore.fetchDeleteQuestion(questionId);
  }

  // endregion

  // region emit
  // endregion

  // region lifecycle
  // endregion
}
</script>
