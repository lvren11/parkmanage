<template>
    <div class="illegal-parking-management">
      <h2>违停信息管理</h2>
      <div class="user-info">
        <span class="user-id">用户ID: {{ userId }}</span>
      </div>
      <el-form :model="violationForm" class="violation-form">
        <!-- 图片上传 -->
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="/upload"
            :auto-upload="false"
            :on-change="handleChange"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>
        <!-- 违停说明 -->
        <el-form-item label="违停说明">
          <el-card class="violation-description">
            <p>
              <span class="serious-violation">严重违停：</span>在主干道路乱停车，影响小区内交通运转，扣除或奖励10积分；
            </p>
            <p>
              <span class="general-violation">一般违停：</span>在支干道乱停车，1天以内扣除或奖励1积分；在物业未找到车主，一周以内扣除或奖励5积分；
            </p>
            <p>
              超过一天仍未联系上，会根据地址去寻找违停车主；在停车位乱停车，扣除或奖励5积分，超过一天扣除或奖励10积分。
            </p>
          </el-card>
        </el-form-item>
        <!-- 违停程度 -->
        <!-- <el-form-item label="违停程度">
          <el-radio-group v-model="violationForm.level">
            <el-radio label="serious">严重违停</el-radio>
            <el-radio label="general">一般违停</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="举报车牌">
          <el-input class="inputbreaking" v-model="violationForm.cnum" placeholder="请输入违停车牌号"></el-input>
        </el-form-item>
        <el-form-item label="违停信息">
          <el-input class="inputbreaking" v-model="violationForm.Info" placeholder="请输入违停信息"></el-input>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
    <div class="violationrecord">
      <h3>违停信息历史记录</h3>
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
          <el-table-column prop="Info" label="违停图片"></el-table-column>
          <el-table-column prop="poster" label="poster">
              <template v-slot="scope">
                <img :src="attachimageurl(scope.row.poster)" style="width: 80px" />
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
          :total="data.length"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </template>
  
  <script>
  import { useStore } from 'vuex';
  import { computed, ref } from 'vue'; // 导入 ref 和 computed
  import { HttpManager } from '@/api/index';
  import { changeState} from "@/utils";
  import { ElMessage} from 'element-plus';

  export default {
    setup() {
      const store = useStore(); // 获取 store
      const userId = computed(() => store.state.user.uid);
      const uid = computed(() => store.state.user.id);

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');

      const dateStr = `${year}-${month}-${day}`;

      const violationForm = ref({
        // level: 'serious', // 违停程度
        uid:uid,
        Date:dateStr,
        state:0,
        poster:'',
        Info:'',
        cnum:''
      });
      const fileurl = '';
      const page = ref(1);
      const pages_size = ref(10);
      const data = ref([]);
      getData();
      async function getData() {
          data.value = [];
          const result = (await HttpManager.getStateBreaking(page.value,pages_size.value,1,2));
          data.value = result.results;
        }
        
      const filteredData = computed(() => {
        return data.value.filter(item => item.state === 1 || item.state === 2);
      });
      const handleChange = (file) => {
        console.log('上传图片:', file);
        // 处理上传图片操作
      };
  
      const submitForm = () => {
        console.log('提交表单:', violationForm.value);
        violationForm.value.poster = fileurl;
        const res = HttpManager.addbreaking(violationForm.value);
        ElMessage.success(`成功上传：${res.message}`);
      };
  
      const handleCurrentChange = (val) => {
        page.value = val;
        getData();
      };
  
      return {
        userId,
        violationForm,
        page,
        pages_size,
        data,
        filteredData,
        handleChange,
        submitForm,
        changeState,
        handleCurrentChange,
        attachimageurl:HttpManager.attachImageUrl,
      };
    },
  };
  </script>
  
  
  <style scoped>
  .illegal-parking-management {
    margin: 20px;
  }
  .user-info {
    float: right;
  }
  .violation-form {
    margin-bottom: 20px;
  }
  .violation-description {
    font-size: 14px;
  }
  .serious-violation {
    color: red;
  }
  .general-violation {
    color: orange;
  }

.inputbreaking{
  width: 400px;
}
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
  