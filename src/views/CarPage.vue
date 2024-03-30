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
        <!-- <el-form-item label="手机号码" class="form-item">
          <el-input v-model="searchForm.tel"></el-input>
        </el-form-item> -->
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
      <!-- <el-table-column prop="id" label="用户ID"></el-table-column>
      <el-table-column prop="tel" label="手机号码"></el-table-column>
      <el-table-column prop="integ" label="积分"></el-table-column> -->
      <el-table-column label="操作" align="center" v-if="roles === 'admin'">
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
import { reactive, ref } from 'vue'; // 导入 reactive 函数
import { useStore } from 'vuex'; // 导入 mapState
import { HttpManager } from '@/api/index';

export default {
  setup() {
    const store = useStore(); // 获取 store
    const vehicleForm = reactive({ // 使用 reactive 创建响应式对象
      uid: '',
      cnum: '',
      carum: ''
    });
    const editDialogVisible = ref(false);
    const editForm = reactive({
      id:'',
      uid: '',
      cnum: '',
      carum: ''
    });
    return {
      currentPage: 1,
      pageSize: 10,
      userId: store.state.user.uid,
      id: store.state.user.id,
      roles: store.state.user.roles,
      vehicleDialogVisible: ref(false),
      totalItems: 0,
      searchForm: reactive({
        cnum: '',
        tel: '',
      }),
      vehicleData: [],
      vehicleForm, // 返回 vehicleForm
      editDialogVisible,
      editForm,
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await HttpManager.getAllCar(this.currentPage,this.pageSize,this.searchForm.cnum);
        this.vehicleData = response.results;
        // this.vehicleData = [{ id:'1', cnum: '沪A12345', carum: '奥迪A6', uid: '2', tel: '13812345678', integ: 90 },
        //   { id:'2',cnum: '京B67890', carum: '宝马X5', uid: '3', tel: '13998765432', integ: 80 },
        //   { id:'3',cnum: '粤C54321', carum: '奔驰C200', uid: '4', tel: '13787654321', integ: 95 },]
        this.totalItems = response.count;
        // this.totalItems = 3;
      } catch (error) {
        console.error('Failed to fetch vehicle data:', error);
      }
    },
    addcar() {
      // 打开新增车辆弹窗的逻辑
      this.vehicleForm.uid = this.id; // 使用 this.userId
      this.vehicleDialogVisible = true;
    },
    submitVehicleForm() {
      // 提交新增车辆表单的逻辑
      console.log('提交新增车辆表单:', this.vehicleForm);
      // 在这里添加实际的提交逻辑
            // 关闭弹窗
      const response = HttpManager.addcar(this.vehicleForm);
        // this.vehicleData = response.results;
      this.$message({
          message: response.message
      });
      this.vehicleDialogVisible = false; // 关闭弹窗
      this.searchForm.cnum = '';
      this.fetchData();
    },

    openEditDialog(row) {
      // 将行数据填充到编辑表单中
      this.editForm.id = row.id;
      this.editForm.uid = row.uid;
      this.editForm.cnum = row.cnum;
      this.editForm.carum = row.carum;
      // 显示弹窗
      this.editDialogVisible = true;
    },

    // 提交修改车辆表单
    submitEditForm() {
      // 此处可添加提交表单的逻辑
      console.log('提交修改车辆表单:', this.editForm);
      const response = HttpManager.updatecar(this.editForm);
        // this.vehicleData = response.results;
      this.$message({
          message: response.message
      });
      this.editDialogVisible = false;
      this.searchForm.cnum = '';
      this.fetchData();
    },
    confirmDeleteRow(row) {
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
    },
    deleteRow(row) {
      // 在这里实现删除操作，可以调用 API 或者修改本地数据
      console.log('删除行:', row);
      HttpManager.deletecar(row.id);
      this.searchForm.cnum = '';
      this.fetchData();
    },
    async search() {
      this.currentPage = 1;
      await this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
  },
  mounted() {
    this.fetchData();
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