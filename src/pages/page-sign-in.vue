<template>
  <div class="sign-in">
    <h1 class="sign-in__title">설문지 시스템</h1>
    <div class="sign-in__body">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="sign-in__form">
        <el-form-item label="ID" prop="userName">
          <el-input placeholder="id를 입력해주세요" v-model="ruleForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input placeholder="password를 입력해주세요" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="sign-in__button" type="success" name="로그인" @click="login('ruleForm')">로그인</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { $adminStore } from '@/store';
import { ElForm } from 'element-ui/types/form';

@Component({})
export default class PageSignIn extends Vue {
  // region local
  ruleForm = {
    userName: '',
    password: '',
    validateId:  (rule, value, callback) => {
      if(value === '') {
        callback(new Error('Id 를 입력해주세요'));
      }
      callback();
    },
    validatePassword: (rule, value, callback) => {
      if(value === '') {
        callback(new Error('password 를 입력해주세요'));
      }
      callback();
    }
  }


  rules = {
    userName: [
      // { validator: this.ruleForm.validateId, trigger: 'blur' }
      { required: true, message: 'Id 를 입력해주세요', trigger: 'blur' },
      { min: 1, message: '최소 1자 이상 입력', trigger: 'blur' }
    ],
    password: [
      // { validator: this.ruleForm.validatePassword, trigger: 'blur' }
      { required: true, message: 'password 를 입력해주세요', trigger: 'blur' },
      { min: 1, message: '최소 1자 이상 입력', trigger: 'blur' }
    ]
  }
  // endregion

  // region method
  login(formName) {
    (this.$refs[formName] as ElForm).validate((valid) => {
      if (valid) {
        // alert('submit!');
        $adminStore.fetchLogin({ userName: this.ruleForm.userName, password: this.ruleForm.password });
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }
  // endregion
}
</script>
