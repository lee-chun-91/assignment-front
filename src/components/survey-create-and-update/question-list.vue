<template>
  <div class="survey-create-and-update question-list">
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
        <div class="survey-create-and-update question"
             v-for="({ questionId, questionName, answerType, answerOptionList }, questionIndex ) in questionList"
             :key="questionId"
        >
          <i class="el-icon-rank handle"></i>
            <div class="question__questionName">
              <el-form-item :prop="'questionList.' + questionIndex + '.questionName'"
                            :rules="{required: true, message: '질문을 입력해주세요', trigger: 'blur'}">
                <el-input class="question__input"
                          type="text" id="질문내용"
                          placeholder="질문을 입력해주세요"
                          name="questionName"
                          :value="questionName"
                          @input="updateQuestionName(questionIndex, $event)">
                </el-input>
              </el-form-item>
              <el-select :value="answerType" @change="handleUpdateAnswerType(questionIndex, $event)">
                <el-option label="YES/NO" :value="AnswerTypes.yesNo"></el-option>
                <el-option label="단일선택" :value="AnswerTypes.oneChoice"></el-option>
                <el-option label="다중선택" :value="AnswerTypes.multipleChoice"></el-option>
              </el-select>
            </div>
            <div class="answer-option-list">
              <div class="answer-option__wrapper" v-for="({id, text}, answerOptionIndex) in answerOptionList" :key="id">
                <div class="answer-option" v-if="isRadioButton(answerType)">
                    <el-radio style="{ margin-right: 0 }" disabled value="false"></el-radio>
                    <el-form-item :prop="'questionList.' + questionIndex + '.answerOptionList.' + answerOptionIndex + '.text'"
                                :rules="[{required: true, message: '답변옵션을 입력해주세요', trigger: 'blur'}]">
                      <el-input class="answer-option__input"
                                type="text"
                                :id="answerOptionIndex"
                                :value="text"
                                @input="handleUpdateAnswerOption(questionIndex, answerOptionIndex, $event)"
                      >
                      </el-input>
                    </el-form-item>
                    <div class="answer-option__button--delete">
                      <el-button size="mini"
                                 circle
                                 :style="isShowDeleteAnswerOptionButton(questionId)"
                                 @click="deleteAnswerOption(questionIndex, answerOptionIndex)">
                        <i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                </div>
                <div class="answer-option" v-else-if="isCheckbox(answerType)">
                  <el-checkbox disabled value="false"></el-checkbox>
                  <el-form-item :prop="'questionList.' + questionIndex + '.answerOptionList.' + answerOptionIndex + '.text'"
                                :rules="{required: true, message: '답변옵션을 입력해주세요', trigger: 'blur'}">
                    <el-input class="answer-option__input"
                              type="text"
                              :id="answerOptionIndex"
                              :value="text"
                              @input="handleUpdateAnswerOption(questionIndex, answerOptionIndex, $event)"
                    >
                    </el-input>
                  </el-form-item>
                  <div class="answer-option__button--delete">
                    <el-button size="mini"
                               circle
                               :style="isShowDeleteAnswerOptionButton(questionId)"
                               @click="deleteAnswerOption(questionIndex, answerOptionIndex)">
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          <div class="question__footer">
            <el-button size="mini"
                       square
                       @click="addAnswerOption(questionIndex)"
                       :style="isShowAddAnswerOptionButton(answerType)"
            >
              + 답변 옵션 추가
            </el-button>
            <el-button size="mini" @click="deleteQuestion(questionId)"> - 질문 삭제 </el-button>
          </div>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import { $surveyStore } from '@/store';
import { IQuestion, ISurvey } from '@/store/modules/module-survey';
import { AnswerTypes } from '@/enum/answer-types';
import _ from 'lodash';

@Component({ components: { draggable } })
export default class QuestionList extends Vue {
  // region Prop
  @Prop ( { type: Object as () => ISurvey }) survey!: ISurvey
  // endregion

  // region local
  enabled = true
  dragging= false
  AnswerTypes = AnswerTypes
  // data() {
  //   return {
  //     validateAnswerOption: () => (rule, value, callback) => {
  //       // console.log(rule, value);
  //       if(!value) {
  //         callback(new Error('답변옵션을 입력해주세요'));
  //       }
  //       else {
  //         callback();
  //       }
  //     }
  //   };
  // }
  // endregion

  // region computed
  get questionList() {
    return $surveyStore.survey.questionList;
  }

  set questionList(questionList: IQuestion[]) {
    $surveyStore.fetchUpdateQuestionOrder(questionList);
  }
  // endregion

  // region method
  updateQuestionName(questionIndex: number, questionName: string) {
    $surveyStore.fetchUpdateQuestionName({ questionIndex, questionName });
  }

  handleUpdateAnswerType(questionIndex: number, answerType: number) {
    $surveyStore.fetchUpdateAnswerType({ questionIndex, answerType });
  }

  isShowAddAnswerOptionButton(answerType: number) {
    return answerType === AnswerTypes.yesNo ?
      { 'visibility': 'hidden' } : { 'visibility': 'visible' };
  }

  addAnswerOption(questionIndex: number,) {
    $surveyStore.fetchAddAnswerOption(questionIndex);
  }

  deleteQuestion(questionId: string) {
    $surveyStore.fetchDeleteQuestion(questionId);
  }

  isRadioButton(answerType: number) {
    return answerType === AnswerTypes.yesNo || answerType === AnswerTypes.oneChoice;
  }

  isCheckbox(answerType: number) {
    return answerType === AnswerTypes.multipleChoice;
  }

  isShowDeleteAnswerOptionButton(questionId: string) {
    const foundIndex = _.findIndex($surveyStore.survey.questionList,(i) => i.questionId === questionId);
    return ($surveyStore.survey.questionList[foundIndex].answerOptionList.length > 2) ?
      { 'visibility': 'visible' } : { 'visibility': 'hidden' };
  }

  handleUpdateAnswerOption(questionIndex: number, answerOptionIndex: number, answerOption: string) {
    $surveyStore.fetchUpdateAnswerOption( { questionIndex, answerOptionIndex, answerOption });
  }
  //
  deleteAnswerOption(questionIndex: number, answerOptionIndex: number) {
    $surveyStore.fetchDeleteAnswerOption({ questionIndex, answerOptionIndex });
  }
  // endregion
}
</script>
