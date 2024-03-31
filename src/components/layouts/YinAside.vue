<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      background-color="#ffffff"
      active-text-color="#30a4fc"
      default-active="2"
      router
      :collapse="collapse"
    >
      <el-menu-item index="info">
        <el-icon><pie-chart /></el-icon>
        <span>系统首页</span>
      </el-menu-item>
      <el-menu-item index="car">
        <el-icon><Document /></el-icon>
        <span>车辆信息管理</span>
      </el-menu-item>
      <el-menu-item index="parkingspot">
        <el-icon><Document /></el-icon>
        <span>停车位信息管理</span>
      </el-menu-item>
      <el-menu-item index="ust">
        <el-icon><User /></el-icon>
        <span>停车位租赁</span>
      </el-menu-item>
      <el-menu-item index="breaking" v-if="role === 0">
        <el-icon><Document /></el-icon>
        <span>违停信息管理</span>
      </el-menu-item>
      <el-menu-item index="rank" v-if="role === 1">
        <el-icon><Document /></el-icon>
        <span>违停奖惩功能</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { PieChart, Mic, Document, User } from "@element-plus/icons-vue";
import emitter from "@/utils/emitter";
import { useStore } from 'vuex'; // 导入 mapState
const collapse = ref(false);
const store = useStore(); // 获取 store
const role =  store.state.user.role;

emitter.on("collapse", (msg) => {
  collapse.value = msg as boolean;
});
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar > ul {
  height: 100%;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 150px;
}
</style>
