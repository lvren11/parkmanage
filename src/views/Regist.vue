<template>
    <div class="login-container">
      <div class="title">{{ nusicName }}</div>
      <div class="login">
        <el-form :model="ruleForm" :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码（大于等于8位）" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item prop="password2">
            <el-input type="password" placeholder="请再次输入密码" v-model="ruleForm.password2"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" type="primary" @click="submitForm">立即注册</el-button>
          </el-form-item>
          <div>
            <a style="float: right" @click="regist">使用已有账户登录</a>
          </div>
        </el-form>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, getCurrentInstance, ref, reactive } from "vue";
  import mixin from "@/mixins/mixin";
  import { HttpManager } from "@/api/index";
  import { RouterName, MUSICNAME } from "@/enums";
  import { ElMessage} from 'element-plus';
  export default defineComponent({
    setup() {
      const { proxy } = getCurrentInstance();
      const { routerManager } = mixin();
  
      const nusicName = ref(MUSICNAME);
      const ruleForm = reactive({
        username: "",
        password: "",
        password2:""
      });
      const rules = reactive({
        username: [{ required: true, message: "请输入手机号", trigger: "blur" },{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" },{ validator: handlePasswordLevel }],
        password2: [{ required: true, message: "请输入密码", trigger: "blur" },{ validator: handlePasswordCheck }],
      });
      async function submitForm() {
        let tel = ruleForm.username;
        let pwd = ruleForm.password;
        const result = (await HttpManager.Register({tel,pwd})) as ResponseBody;
        if (result.code === 200) {
            proxy.$store.commit("setUser", result.data);
            ElMessage.error(`注册成功`);
            routerManager(RouterName.Info, { path: RouterName.Info });
        }else{
          ElMessage.error(`注册失败`);
        }
      }
      function regist () {
        routerManager(RouterName.SignIn, { path: RouterName.SignIn });
      }

    function handlePasswordLevel (rule, value, callback) {
        let level = 0

        // 判断密码中是否包含数字
        if (/\d/.test(value)) {
            level++
        }

        // 判断密码中是否包含小写字母
        if (/[a-z]/.test(value)) {
            level++
        }

        // 判断密码中是否包含大写字母
        if (/[A-Z]/.test(value)) {
            level++
        }

        // 判断密码中是否包含特殊字符
        if (/[^0-9a-zA-Z]/.test(value)) {
            level++
        }
        if (value.length >= 8 && level >= 2) {
            callback();
        } else {
            callback(new Error('密码是包含大小写字母，数字，特殊字符其中两样'));
        }
    }

    function handlePasswordCheck (rule, value, callback) {
        let password = ruleForm.password;
        if (value === undefined) {
            callback(new Error('请输入密码'))
        }
        if (value && password && value.trim() !== password.trim()) {
            callback(new Error('两次密码不一致'))
        }
        callback()
    }

      return {
        nusicName,
        ruleForm,
        rules,
        submitForm,
        regist
      };
    },
  });
  </script>
  
  
  <style scoped>
  .login-container {
    position: relative;
    background: url("../assets/images/house.jpg") center/cover no-repeat;
    width: 100%;
    height: 100%;
  }
  
  .title {
    font-size: 36px;
    font-weight: bold;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    margin-bottom: 20px;
  }
  
  .login {
    width: 300px;
    margin: 0 auto;
    padding: 40px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  
  .el-input {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .login-btn {
    width: 100%;
  }
  </style>