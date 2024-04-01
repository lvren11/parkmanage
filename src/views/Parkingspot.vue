<template>
  <div class="parking-info">
    <h2>停车位信息管理</h2>
    <div class="user-info">
      <span class="user-id">用户ID: {{ userId }}</span>
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="停车位号" class="form-item">
          <el-input v-model="searchForm.pnum"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" class="form-item">
          <el-input v-model="searchForm.cnum"></el-input>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item class="form-item" v-if="isAdmin">
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="parkingData" border stripe>
      <el-table-column prop="pnum" label="停车位号"></el-table-column>
      <el-table-column prop="pst" label="停车位状态">
        <template v-slot="scope">
          <div :style="getStatusStyle(scope.row.pst)" class="clickable" @click="handleClick(scope.row)">{{ getstatustext(scope.row.pst) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="ust" label="租户身份">
        <template v-slot="scope">
          <div>{{ gettenantstatus(scope.row.ust) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="cnum" label="车牌号"></el-table-column>
      <!-- <el-table-column prop="uid" label="用户ID"></el-table-column>
      <el-table-column prop="tel" label="手机号码"></el-table-column>
      <el-table-column prop="integ" label="积分"></el-table-column> -->
      <el-table-column prop="startdate" label="租赁起始日期"></el-table-column>
      <el-table-column prop="enddate" label="租赁终止日期"></el-table-column>
      <el-table-column label="操作" v-if="isAdmin">
        <template v-slot="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="confirmDeleteRow(scope.row)">删除</el-button>
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
<el-dialog v-model="addDialogVisible" title="添加停车位信息">
  <el-form :model="addForm" ref="addForm" :rules="addFormRules" label-width="100px">
    <el-form-item label="停车位号" prop="pnum">
      <el-input v-model="addForm.pnum" ></el-input>
    </el-form-item>
    <!-- <el-form-item label="车牌号" prop="cnum">
      <el-input v-model="addForm.cnum"></el-input>
    </el-form-item>
    <el-form-item label="停车位状态" prop="pst">
      <el-radio-group v-model="addForm.pst">
        <el-radio :label="'0'">空闲</el-radio>
        <el-radio :label="'1'">租赁</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="租户类别" prop="ust">
      <el-radio-group v-model="addForm.ust">
        <el-radio :label="'d'">临时组户</el-radio>
        <el-radio :label="'m'">月</el-radio>
        <el-radio :label="'j'">季</el-radio>
        <el-radio :label="'y'">年</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="起始日期" prop="startdate">
      <el-date-picker v-model="addForm.startdate" type="date" placeholder="选择日期" style="width:100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="终止日期" prop="enddate">
      <el-date-picker v-model="addForm.enddate" type="date" placeholder="选择日期" style="width:100%;"></el-date-picker>
    </el-form-item> -->
  </el-form>
  <div class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitAddForm">确 定</el-button>
  </div>
</el-dialog>
<!-- 修改停车位信息弹窗 -->
<el-dialog v-model="editDialogVisible" title="修改停车位信息">
  <el-form :model="editForm" ref="editForm" label-width="100px">
    <el-form-item label="停车位号" prop="pnum">
      <el-input v-model="editForm.pnum" ></el-input>
    </el-form-item>
    <el-form-item label="车牌号" prop="cnum">
      <el-input v-model="editForm.cnum"></el-input>
    </el-form-item>
    <el-form-item label="停车位状态" prop="pst">
      <el-radio-group v-model="editForm.pst">
        <el-radio :label="'0'">空闲</el-radio>
        <el-radio :label="'1'">租赁</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="租户类别" prop="ust">
      <el-radio-group v-model="editForm.ust">
        <el-radio :label="'d'">临时组户</el-radio>
        <el-radio :label="'m'">月</el-radio>
        <el-radio :label="'j'">季</el-radio>
        <el-radio :label="'y'">年</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="起始日期" prop="startdate">
      <el-date-picker v-model="editForm.startdate" type="date" placeholder="选择日期" style="width:100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="终止日期" prop="enddate">
      <el-date-picker v-model="editForm.enddate" type="date" placeholder="选择日期" style="width:100%;"></el-date-picker>
    </el-form-item>
  </el-form>
  <div class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitEditForm">确 定</el-button>
  </div>
</el-dialog>

</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex'; // 导入 mapState
import { HttpManager } from '@/api/index';
import { getStatusText, getTenantStatus} from "@/utils";
import { RouterName } from "@/enums";
import { ElMessage} from 'element-plus';
export default {
  data() {
    const store = useStore(); // 获取 store
    return {
      currentPage: 1,
      pageSize: 10,
      userId: store.state.user.uid,
      isAdmin: store.state.user.role === 1, // 根据用户角色确定是否为管理员
      id: store.state.user.id,
      totalItems: 0,
      searchForm: {
        pnum: '',
        cnum: '',
      },
      parkingData: [],
      editDialogVisible: false,
      editForm: {
        id:'',
        pnum: '',
        cnum: '',
        user_id:'',
        pst: "0",
        ust: 'd',
        startdate: '',
        enddate: ''
      },
      addDialogVisible: false,
      addForm: {
        pnum: '',
        cnum: '',
        user_id:'',
        pst: '',
        ust: '',
        startdate: '',
        enddate: ''
      },
      addFormRules: {
        cnum: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
        ],
        pst: [
          { required: true, message: '请选择停车位状态', trigger: 'change' },
        ],
        ust: [
          { required: true, message: '请选择租户类别', trigger: 'change' },
        ],
        startdate: [
          { required: true, message: '请选择起始日期', trigger: 'change' },
        ],
        enddate: [
          { required: true, message: '请选择终止日期', trigger: 'change' },
        ],
      }
    };
  },
  // computed: {
  //   filteredData() {
  //     return this.parkingData.filter(item =>
  //       item.pnum.includes(this.searchForm.pnum) &&
  //       item.cnum.includes(this.searchForm.cnum)
  //     );
  //   },
  // },
  methods: {
    async fetchData() {
      try {
        // 假数据
        // const fakeData = [
        //   { id: '1', pnum: 'P001', cnum: '沪A12345', uid: 'U123456', tel: '13812345678', integ: 90, pst: '0', startdate: '2024/01/01', enddate: '2024/02/01', ust: 'd' },
        //   { id: '2', pnum: 'P002', cnum: '京B67890', uid: 'U234567', tel: '13998765432', integ: 80, pst: '1', startdate: '2024/01/15', enddate: '2024/02/15', ust: 'm' },
        //   { id: '3', pnum: 'P003', cnum: '粤C54321', uid: 'U345678', tel: '13787654321', integ: 95, pst: '0', startdate: '2024/02/01', enddate: '2024/03/01', ust: 'y' },
        // ];
        const response = await HttpManager.getAllparkinglot(this.currentPage,this.pageSize,this.searchForm.pnum,this.searchForm.cnum);
        this.parkingData = response.results;
        this.totalItems = response.count;
        // this.parkingData = fakeData;
        // this.totalItems = fakeData.length;
      } catch (error) {
        console.error('Failed to fetch parking data:', error);
      }
    },
    async search() {
      this.currentPage = 1;
      await this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    handleClick(row) {
      if (row.pst === 0) {
        this.$router.push({ path: RouterName.ust, query: { pnum: row.pnum }});
      }
    },
    getStatusStyle(pst) {
      return pst === 0 ? { color: 'green' } : { color: 'red' };
    },
    handleAdd() {
      // 打开添加停车位信息弹窗
      this.addDialogVisible = true;
    },
    async submitAddForm() {
      // 提交添加停车位信息表单
      console.log('提交添加停车位信息表单:', this.addForm);
      // 关闭弹窗
      const response = await HttpManager.addparkinglot(this.addForm);
        // this.vehicleData = response.results;
      this.addDialogVisible = false;
      // 调用接口或其他操作进行添加操作
      if(response.code === 400){
        ElMessage.error(`${response.message}`);
      }else{
        ElMessage.success(`${response.message}`);
      }
      // 添加完成后，刷新数据列表
      this.searchForm.pnum = '';
      this.searchForm.cnum = '';
      await this.fetchData();
    },
    handleEdit(row) {
      // 打开修改停车位信息弹窗，并将对应行的信息赋值给编辑表单
      this.editForm = { ...row }; // 将行数据赋值给编辑表单
      this.editDialogVisible = true; // 打开弹窗
    },
    getstatustext(val){
      return getStatusText(val)
    },
    gettenantstatus(val){
      return getTenantStatus(val)
    },
    async submitEditForm() {
      try {
        // 这里添加提交修改停车位信息的逻辑
        console.log('提交修改停车位信息表单:', this.editForm);
        // 关闭弹窗
        const response = await HttpManager.updateparkinglot(this.editForm);
        // this.vehicleData = response.results;
        this.editDialogVisible = false;
        if(response.code === 400){
          ElMessage.error(`${response.message}`);
        }else{
          ElMessage.success(`${response.message}`);
        }
        this.searchForm.pnum = '';
        this.searchForm.cnum = '';
        // 调用接口或其他操作进行修改操作
        await this.fetchData();
      } catch (error) {
        console.error('Failed to submit edit form:', error);
      }
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
    async deleteRow(row) {
      // 在这里实现删除操作，可以调用 API 或者修改本地数据
      console.log('删除行:', row);
      await HttpManager.deleteparkinglot(row.id);
      this.searchForm.pnum = '';
      this.searchForm.cnum = '';
      await this.fetchData();
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.parking-info {
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
.pagination {
  text-align: center;
  margin-top: 20px;
}
.clickable {
  cursor: pointer;
}
</style>
