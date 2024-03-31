<template>
  <div class="illegal-parking-management">
    <h2>违停奖惩功能</h2>
    <div class="violationrecord">
      <div class="container">
        <el-table :data="data" style="width: 100%">
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
                <img :src="HttpManager.attachImageUrl(scope.row.poster)" style="width: 80px; cursor: pointer;" @click="showPreview(scope.row)" />
                <el-dialog :visible="dialogVisible" width="50%" :title="previewTitle">
                  <img width="100%" :src="previewImageUrl" alt="图片预览" />
                </el-dialog>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="举报日期"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button v-if="scope.row.state === 0" type="primary" @click="openApprovalDialog(scope.row)">审核</el-button>
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
    <el-dialog v-model="approvalDialogVisible" title="审核" width="30%">
      <el-radio-group v-model="selectedApprovalState">
        <el-radio :label="-1">不通过</el-radio>
        <el-radio :label="1">一般违停</el-radio>
        <el-radio :label="2">严重违停</el-radio>
      </el-radio-group>
      <el-button class ="buttons" type="primary" @click="submitApproval">确定</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { changeState } from "@/utils";
import { HttpManager } from "@/api";
import { ElMessage } from 'element-plus';

const page = ref(1);
const pages_size = ref(10);
const data = ref([]);
const approvalDialogVisible = ref(false);
const selectedRow = ref(null);
const selectedApprovalState = ref(1);

const fetchData = async () => {
  try {
    const result = await HttpManager.getAdminBreaking(page.value, pages_size.value,0,-1,1,2);
    data.value = result.results;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};
fetchData();
const openApprovalDialog = (row) => {
  selectedRow.value = row;
  approvalDialogVisible.value = true;
};

const handleCurrentChange = async (val) => {
  page.value = val;
  await fetchData();
};

const submitApproval = async () => {
  const row = selectedRow.value;
  row.state = selectedApprovalState.value;
  const res = await HttpManager.breakingaccess(row);
  approvalDialogVisible.value = false;
  ElMessage.success(`审核成功：${res.message}`);
  selectedRow.value = null;
  await fetchData();
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
.buttons{
  margin-left: 20px;
}
</style>
