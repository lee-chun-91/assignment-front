<template>
  <div class="admin-main">
    <div class="admin-main-content" v-show="infoListEmpty">만들어진 설문이 아직 없습니다.</div>
    <div class="admin-main-content" v-show="!infoListEmpty">
      <table class="table">
        <thead class="table__thead">
        <tr class="table__tr">
          <th>설문지 이름</th>
          <th>질문 갯수</th>
          <th>질문지 수정</th>
          <th>리포트</th>
          <th>로그</th>
          <th>설문지 배포</th>
        </tr>
        </thead>
        <tbody class="table__tbody">
        <tr class="table__tr"
            :key="index"
            v-for="(info, index) in infoList"
            :class="coloredRow(index)"
        >
          <td>{{ info.name }}</td>
          <td>{{ info.email }}</td>
          <td>{{ info.phoneNumber }}</td>
          <td>{{ info.date }}</td>
          <td>
            <router-link
              :to="{
                  name: 'updateInfo',
                  params: { id: info.id },
                }"
            >
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
              ></el-button
              ></router-link>
          </td>
          <td>
            <div @click="deleteItem(info.id)">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-delete"
              ></el-button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import AdminHeader from '@/layouts/admin-header.vue';
import { $surveyStore } from '@/store';

@Component({
  components: { AdminHeader }
})
export default class PageAdminMain extends Vue {
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
