<template>
    <div class="violationinfo">
      <div class="violationrules">
        <div class="rulebox">
          <h2>违停奖惩规则：</h2>
          <p>
            <span class="severeviolation">严重违停：</span>在主干道路乱停车，影响小区内交通运转，扣除或奖励10积分；
          </p>
          <p>
            <span class="normalviolation">一般违停：</span>在支干道乱停车，1天以内扣除或奖励1积分；在物业未找到车主，一周以内扣除或奖励5积分；超过一天仍未联系上，会根据地址去寻找违停车主；在停车位乱停车，扣除或奖励5积分，超过一天扣除或奖励10积分。
          </p>
        </div>
        <p>希望居民朋友们积极发现并上传违停现象，解决停车乱象，为小区所有居民创造一个安全、便捷、舒适的停车环境。</p>
      </div>
      <div class="violationrecord">
      <h3>小区全部用户的违停信息记录</h3>
      </div>
      <div class="container">
        <el-table :data="filteredData" style="width: 100%">
          <!-- <el-table-column prop="id" label="Id"></el-table-column> -->
          <el-table-column prop="uid" label="举报人id"></el-table-column>
          <el-table-column prop="cnum" label="被举报车辆号"></el-table-column>
          <el-table-column prop="state" label="举报状态">
            <template v-slot="scope">
              <div>{{ changeState(scope.row.state) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="Info" label="违停信息"></el-table-column>
          <el-table-column prop="poster" label="违停图片">
              <template v-slot="scope">
                <img :src="attachImageUrl(scope.row.poster)" style="width: 80px" />
              </template>
          </el-table-column>
          <el-table-column prop="Date" label="举报日期"></el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          layout="total, prev, pager, next"
          :current-page="page"
          :page-size="pages_size"
          :total="filteredData.length"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from "vue";
  import { HttpManager } from "@/api";
  import { changeState} from "@/utils";
  
  export default defineComponent({
    setup() {
        const page = ref(1); 
        const pages_size = ref(10); 
        const data = ref([
          ]);
  
        getData();
  
        async function getData() {
          data.value = [];
          const result = (await HttpManager.getStateBreaking(page.value,pages_size.value,1,2)) as ResponseBody;
          data.value = result.results;
        }
  
        // 获取当前页
        function handleCurrentChange(val) {
          page.value = val;
          getData();
        }

        const filteredData = computed(() => {
          return data.value.filter(item => item.state === 1 || item.state === 2);
        });
        const attachImageUrl = (file) =>{
          return URL.createObjectURL(file);
        }
      return {
        filteredData,
        page,
        pages_size,
        changeState,
        attachImageUrl,
        handleCurrentChange
      };
    },
  });
  </script>
  
<style scoped>
.violationinfo {
  padding: 20px;
}

.violationrules {
  margin-bottom: 20px;
}

.rulebox {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.rulebox h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.rulebox p {
  margin-bottom: 5px;
}

.severeviolation {
  color: red;
}

.normalviolation {
  color: orange;
}

.violationrecord el-input {
  margin-bottom: 10px;
}

.violationrecord h3 {
  margin-bottom: 10px;
}
</style>
