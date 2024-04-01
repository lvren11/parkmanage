<template>
    <div class="login-container">
      <div class="title">{{ nusicName }}</div>
      <div class="login">
        <el-form :model="ruleForm" :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="telephone">
            <el-input v-model="ruleForm.telephone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入新密码" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" type="primary" @click="submitForm">修改密码</el-button>
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
        telephone:""
      });
      const rules = reactive({
        telephone: [{ required: true, message: "请输入手机号", trigger: "blur" },{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }],
        password: [{ required: true, message: "请输入新密码", trigger: "blur" },{ validator: handlePasswordLevel }],
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      });
      async function submitForm() {
        let uid = ruleForm.username;
        let tel = ruleForm.telephone;
        let pwd = ruleForm.password;
        const result = (await HttpManager.forgetpwd({uid,tel,pwd})) as ResponseBody;
        if (result.code === 200) {
            // proxy.$store.commit("setUser", result.data);
            ElMessage.success(`修改密码成功`);
            routerManager(RouterName.SignIn, { path: RouterName.SignIn });
        }else{
            ElMessage.error(`修改密码失败`);
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