<template>
  <div class="login-container">
    <div class="title">{{ nusicName }}</div>
    <div class="login">
      <el-form :model="ruleForm" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter="submitForm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="submitForm">登录</el-button>
        </el-form-item>
        <div>
          <a style="float: left" >忘记密码</a>
          <a style="float: right" @click="regist">注册账户</a>
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
    });
    const rules = reactive({
      username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    });
    async function submitForm() {
      let uid = ruleForm.username;
      let pwd = ruleForm.password;
      const result = (await HttpManager.getLoginStatus({uid,pwd})) as ResponseBody;
      if (result.code === 200) {
        proxy.$store.commit("setUser", result.data);
        routerManager(RouterName.Info, { path: RouterName.Info });
      }else{
        ElMessage.error(`登录失败`);
      }
    }
    function regist () {
      routerManager(RouterName.Regist, { path: RouterName.Regist });
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