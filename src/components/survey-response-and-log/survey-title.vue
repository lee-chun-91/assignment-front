<template>
  <div class="survey-title">
    <h1 class="survey-title__surveyName">{{surveyName}}</h1>
    <p class="survey-title__userName">{{description}}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { $surveyStore } from '@/store';

@Component({})
export default class SurveyTitle extends Vue {
  // region prop
  @Prop({ type: String }) userName!: string
  // endregion

  // region computed
  get surveyName() {
    return $surveyStore.survey.surveyName;
  }

  get description() {
    const routeName = this.$route.name;

    if(routeName === '개별 로그') return `${this.userName} 님의 응답`;
    else { return `${this.userName} 님, 설문에 응답해주세요.`;}
  }
  // endregion

  // region lifecycle
  created() {
    console.log(this.userName);
  }
  // endregion
}
</script>
