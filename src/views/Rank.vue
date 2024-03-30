<template>
    <div class="illegal-parking-management">
      <h2>违停奖惩功能</h2>
      <div class="violationrecord">
        <div class="container">
          <el-table :data="data" style="width: 100%">
            <!-- <el-table-column prop="id" label="Id"></el-table-column> -->
            <el-table-column prop="uid" label="举报人id"></el-table-column>
            <el-table-column prop="cnum" label="被举报车辆号"></el-table-column>
            <el-table-column prop="state" label="举报状态">
              <template v-slot="scope">
                <div>{{ changestate(scope.row.state) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="Info" label="违停信息"></el-table-column>
            <el-table-column prop="poster" label="违停图片">
              <template v-slot="scope">
                <img :src="attachimageurl(scope.row.poster)" style="width: 80px; cursor: pointer;" @click="showPreview(scope.row)" />
                <el-dialog :visible="dialogVisible" width="50%" :title="previewTitle">
                  <img width="100%" :src="previewImageUrl" alt="图片预览" />
                </el-dialog>
              </template>
            </el-table-column>
            <el-table-column prop="Date" label="举报日期"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button v-if="scope.row.state === 0" type="primary" @click="confirmViolation(scope.row)">审核</el-button>
              </template>
            </el-table-column>
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
    </div>
  </template>
  
  <script>
  import { changeState } from "@/utils";
  import { HttpManager } from "@/api";
  import { ElMessage } from 'element-plus';
  export default {
    data() {
      return {
        page: 1,
        pages_size: 10,
        data: [
        ],
        dialogVisible: false,
        previewTitle: "",
        previewImageUrl: "",
      };
    },
    methods: {
      async fetchData() {
        try {
          const result = (await HttpManager.getAllBreaking(page,pages_size));
          data.value = result.results;
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      },
      changestate(val) {
        return changeState(val);
      },
      handleCurrentChange(val) {
        this.page = val;
        this.fetchData();
      },
      attachimageurl(val) {
        return HttpManager.attachImageUrl(val);
      },
      confirmViolation(row) {
        const res = HttpManager.breakingaccess(row);
        ElMessage.success(`审核成功：${res.message}`);
      },
      showPreview(row) {
        this.dialogVisible = true;
        this.previewTitle = "图片预览";
        this.previewImageUrl = row.poster;
      },
    },
    mounted() {
    this.fetchData(); // 组件加载完成时获取数据
  },
  };
  </script>
  
<style scoped>
.illegal-parking-management {
margin: 20px;
}

.violationrecord {
padding: 20px;
}

.violationrecord el-input {
margin-bottom: 10px;
}

.violationrecord h3 {
margin-bottom: 10px;
}
</style>
