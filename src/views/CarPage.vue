<template>
  <div class="vehicle-info">
    <h2>小区车辆信息</h2>
    <div class="user-info">
      <span class="user-id">用户ID: {{ userId }}</span>
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="车牌号" class="form-item">
          <el-input v-model="searchForm.cnum"></el-input>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button type="primary" @click="addcar">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="vehicleData" border stripe>
      <el-table-column prop="cnum" label="车牌号"></el-table-column>
      <el-table-column prop="carum" label="车辆信息"></el-table-column>
      <el-table-column prop="uid" label="用户ID"></el-table-column>
      <el-table-column prop="tel" label="手机号码"></el-table-column>
      <el-table-column prop="integ" label="积分"></el-table-column>
      <el-table-column label="操作" align="center" v-if="role === 1">
        <template #default="{ row }">
          <el-button type="text" @click="openEditDialog(row)">修改</el-button>
          <el-button type="text" @click="confirmDeleteRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalItems"
    ></el-pagination>
  </div>

  <!-- 新增车辆弹窗 -->
  <el-dialog title="新增车辆" v-model="vehicleDialogVisible">
    <el-form :model="vehicleForm" label-width="80px">
      <el-form-item label="用户ID">
        <el-input v-model="vehicleForm.uid" disabled></el-input>
      </el-form-item>
      <el-form-item label="车辆号">
        <el-input v-model="vehicleForm.cnum"></el-input>
      </el-form-item>
      <el-form-item label="车辆信息">
        <el-input v-model="vehicleForm.carum"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="vehicleDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitVehicleForm">确定</el-button>
    </div>
  </el-dialog>

  <!-- 修改车辆弹窗 -->
  <el-dialog title="修改车辆" v-model="editDialogVisible">
    <el-form :model="editForm" label-width="80px">
      <el-form-item label="用户ID">
        <el-input v-model="editForm.uid" disabled></el-input>
      </el-form-item>
      <el-form-item label="车辆号">
        <el-input v-model="editForm.cnum"></el-input>
      </el-form-item>
      <el-form-item label="车辆信息">
        <el-input v-model="editForm.carum"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitEditForm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import { HttpManager } from '@/api/index';

export default {
  setup() {
    const store = useStore();

    const currentPage = ref(1);
    const pageSize = ref(10);
    const userId = ref(store.state.user.uid);
    const id = ref(store.state.user.id);
    const role = ref(store.state.user.role);
    const vehicleDialogVisible = ref(false);
    const editDialogVisible = ref(false);
    const totalItems = ref(0);
    const searchForm = reactive({
      cnum: '',
      tel: ''
    });
    const vehicleData = ref([]);
    const vehicleForm = reactive({
      uid: '',
      cnum: '',
      carum: ''
    });
    const editForm = reactive({
      id: '',
      uid: '',
      cnum: '',
      carum: ''
    });
    fetchData();
    const fetchData = async () => {
      try {
        const response = await HttpManager.getAllCar(
          currentPage.value,
          pageSize.value,
          searchForm.cnum
        );
        vehicleData.value = response.results;
        totalItems.value = response.count;
      } catch (error) {
        console.error('Failed to fetch vehicle data:', error);
      }
    };

    const addcar = () => {
      vehicleForm.uid = id.value;
      vehicleDialogVisible.value = true;
    };

    const submitVehicleForm = async () => {
      const response = await HttpManager.addcar(vehicleForm);
      console.log('提交新增车辆表单:', vehicleForm);
      console.log('Response:', response);
      // Handle response
      vehicleDialogVisible.value = false;
      searchForm.cnum = '';
      fetchData();
    };

    const openEditDialog = (row) => {
      editForm.id = row.id;
      editForm.uid = row.uid;
      editForm.cnum = row.cnum;
      editForm.carum = row.carum;
      editDialogVisible.value = true;
    };

    const submitEditForm = async () => {
      const response = await HttpManager.updatecar(editForm);
      console.log('提交修改车辆表单:', editForm);
      console.log('Response:', response);
      // Handle response
      editDialogVisible.value = false;
      searchForm.cnum = '';
      fetchData();
    };
    const confirmDeleteRow = (row) => {
      // 确认删除操作
      this.$confirm('此操作将永久删除该行数据，是否继续？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 确认删除后的逻辑，调用删除函数并传入行数据
              this.deleteRow(row);
            }).catch(() => {
              // 用户取消删除操作
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
    };
    const deleteRow = (row) => {
      // 在这里实现删除操作，可以调用 API 或者修改本地数据
      console.log('删除行:', row);
      HttpManager.deletecar(row.id);
      this.searchForm.cnum = '';
      this.fetchData();
    };
    const search = async () => {
      currentPage.value = 1;
      await fetchData();
    };

    const handleCurrentChange = (val) => {
      currentPage.value = val;
      fetchData();
    };
    return {
      currentPage,
      pageSize,
      userId,
      id,
      role,
      vehicleDialogVisible,
      editDialogVisible,
      totalItems,
      searchForm,
      vehicleData,
      vehicleForm,
      editForm,
      fetchData,
      addcar,
      submitVehicleForm,
      openEditDialog,
      submitEditForm,
      confirmDeleteRow,
      deleteRow,
      search,
      handleCurrentChange
    };
  },
};
</script>

<style scoped>
.vehicle-info {
  margin: 0 auto;
}
.user-info {
  float: right;
  margin-right: 20px;
  font-size: 14px;
}
.user-id {
  font-weight: bold;
}
.search-bar {
  margin-top: 20px;
  margin-bottom: 20px;
}
.search-form .form-item {
  margin-right: 20px;
}
.pagination-center {
  text-align: center;
  margin-top: 20px;
}
</style>    