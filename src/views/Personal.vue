<template>
  <div class="personal-info">
    <h3>个人信息管理</h3>
    <!-- 用户信息表单 -->
    <el-form ref="userInfoForm" :model="user" label-width="100px">
      <el-form-item label="用户ID">
        <el-input v-model="user.uid" :disabled="!editing"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="user.tel" :disabled="!editing"></el-input>
      </el-form-item>
      <!--  <el-form-item label="车牌号">
        <el-input v-model="user.cnum" :disabled="!editing"></el-input>
      </el-form-item>
      <el-form-item label="停车位号">
        <el-input v-model="user.pnum" :disabled="!editing"></el-input>
      </el-form-item> -->
      <el-form-item label="个人住址">
        <el-input v-model="user.addr" :disabled="!editing"></el-input>
      </el-form-item>
      <el-form-item label="积分">
        <el-input v-model="user.integ" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toggleEdit">{{ editing ? '取消编辑' : '编辑' }}</el-button>
        <el-button type="primary" v-if="editing" @click="submit">提交</el-button>
        <!-- 修改密码按钮 -->
        <el-button type="primary" @click="changePassword">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class = "tableinfo">
    <!-- 个人车辆信息表格 -->
    <div class="vehicle-info">
      <h3>个人车辆信息</h3>
      <el-table :data="vehicleData">
        <!-- 表头 -->
        <el-table-column prop="cnum"  label="车牌号"></el-table-column>
        <el-table-column prop="carum"  label="车辆信息"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="text" @click="editVehicle(row)">编辑</el-button>
            <el-button type="text" @click="confirmDeleteVehicle(row)">删除</el-button>
          </template>
      </el-table-column>
        <!-- 添加按钮 -->
        <el-table-column align="center">
          <template v-slot:header>
            <el-button type="text" @click="addVehicle">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          background
          layout="total, prev, pager, next"
          :current-page="userpage"
          :page-size="userpages_size"
          :total="vehicleData.length"
          @current-change="handlevehicleDataChange"
        >
        </el-pagination>
    </div>
    <!-- 个人举报记录信息表格 -->
    <div class="container">
      <h3>个人举报记录信息</h3>
        <el-table :data="filteredData" style="width: 100%">
          <el-table-column prop="cnum" label="被举报车辆号"></el-table-column>
          <el-table-column prop="state" label="举报状态">
            <template v-slot="scope">
              <div>{{ changeState(scope.row.state) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="info" label="违停信息"></el-table-column>
          <el-table-column prop="poster" label="违停图片">
              <template v-slot="scope">
                <img :src="attachImageUrl(scope.row.poster)" style="width: 80px" />
              </template>
          </el-table-column>
          <el-table-column prop="date" label="举报日期">
            <template v-slot="scope">
              <div>{{ dataformat(scope.row.date) }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template v-slot:header>
              <el-button type="text" @click="addReport">添加</el-button>
            </template>
          </el-table-column>
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

    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" v-model="passwordDialogVisible">
      <el-form :model="passwordForm" label-width="80px">
        <el-form-item label="用户ID">
          <el-input v-model="passwordForm.uid" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPasswordForm">确定</el-button>
      </div>
    </el-dialog>

      <!-- 新增车辆弹窗 -->
    <el-dialog title="新增车辆" v-model="vehicleDialogVisible">
      <el-form :model="vehicleForm" label-width="80px">
        <!-- <el-form-item label="用户ID">
          <el-input v-model="vehicleForm.uid" disabled></el-input>
        </el-form-item> -->
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

    <el-dialog title="编辑车辆" v-model="editVehicleDialogVisible">
    <el-form :model="editedVehicleForm" label-width="80px">
      <!-- <el-form-item label="用户ID">
        <el-input v-model="editedVehicleForm.uid" disabled></el-input>
      </el-form-item> -->
      <el-form-item label="车辆号">
        <el-input v-model="editedVehicleForm.cnum"></el-input>
      </el-form-item>
      <el-form-item label="车辆信息">
        <el-input v-model="editedVehicleForm.carum"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="editVehicleDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitEditedVehicleForm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { HttpManager } from "@/api";
import { defineComponent, getCurrentInstance, computed, ref,reactive } from "vue";
import { useStore } from 'vuex';
import { changeState, dataformat} from "@/utils";
import { RouterName } from "@/enums";
import mixin from "@/mixins/mixin";
import { ElMessageBox } from "element-plus";
import { ElMessage} from 'element-plus';
export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    const { routerManager } = mixin();
    const editing = ref(false);
    const store = useStore();
    const page = ref(1);
    const pages_size = ref(10);
    const userpage = ref(1);
    const userpages_size = ref(10);
    const user =  computed(() => store.getters.user).value;
    const vehicleData = ref([
    ]); // 个人车辆信息数据
    const filteredData = ref([]);
    // const data = ref([
    //       {    
    //         id: 1,
    //         uid: 457101,
    //         cnum: "京A12345",
    //         state: 1,
    //         Info: "在主干道路乱停车",
    //         poster: "url/to/image1.jpg",
    //         Date: "2024-03-27",
    //       },
    //       {
    //         id: 2,
    //         uid: 857102,
    //         cnum: "京B54321",
    //         state: 2,
    //         Info: "在支干道乱停车",
    //         poster: "url/to/image2.jpg",
    //         Date: "2024-03-28",
    //       },
    //       {
    //         id: 3,
    //         uid: 671087,
    //         cnum: "京B54532",
    //         state: -1,
    //         Info: "在支干道乱停车",
    //         poster: "url/to/image3.jpg",
    //         Date: "2024-03-29",
    //       },
    //       {
    //         id: 4,
    //         uid: 671587,
    //         cnum: "京B54532",
    //         state: 0,
    //         Info: "在支干道乱停车",
    //         poster: "url/to/image4.jpg",
    //         Date: "2024-03-29",
    //       },
    //       // Add more data entries here
    //     ]);
    getuser(user.uid);
    getVehicledata(user.id);
    getcardata(user.id);

    async function submit() {
      const formData = user;
      console.log(formData);
      toggleEdit();
      const result = (await HttpManager.updateUserMsg(formData)) as ResponseBody;
      if (result.code === 200) {
          proxy.$store.commit("setUser", formData);
      }
    }

    function toggleEdit() {
      editing.value = !editing.value;
    }

    // 修改密码弹窗相关数据和方法
    const passwordDialogVisible = ref(false);
    const passwordForm = reactive({
      uid: '',
      newPassword: ''
    });

    function changePassword() {
      // 打开修改密码弹窗的逻辑
      passwordForm.uid = user.uid;
      passwordDialogVisible.value = true;
    }
    
    async function submitPasswordForm() {
      // 提交修改密码表单的逻辑
      console.log('提交修改密码表单:', passwordForm);
      const userinfo = user;
      userinfo.pwd = passwordForm.newPassword;
      const result = (await HttpManager.updateUserMsg(userinfo)) as ResponseBody;
      // 在这里添加实际的提交逻辑
      passwordDialogVisible.value = false; // 关闭弹窗
      ElMessage.success(`成功修改：${result.message}`);
    }


    // 新增车辆弹窗相关数据和方法
    const vehicleDialogVisible = ref(false);
    const vehicleForm = reactive({
      user_id: '',
      cnum: '',
      carum: ''
    });

    function addVehicle() {
      // 打开新增车辆弹窗的逻辑
      vehicleForm.user_id = user.id;
      vehicleDialogVisible.value = true;
    }


    async function submitVehicleForm() {
      // 提交新增车辆表单的逻辑
      console.log('提交新增车辆表单:', vehicleForm);
      const response = (await HttpManager.addcar(vehicleForm)) as ResponseBody;
        // this.vehicleData = response.results;
      vehicleDialogVisible.value = false; // 关闭弹窗
      if(response.code === 400){
        ElMessage.error(`${response.message}`);
      }else{
        ElMessage.success(`${response.message}`);
      }
      getcardata(user.id);
    }

    async function getcardata(uiddata){
      const response = (await HttpManager.getMyCar(userpage.value,userpages_size.value,uiddata)) as ResponseBody;
      vehicleData.value = response.results;
    }

    async function getVehicledata(uiddata){
      const response = (await HttpManager.getMyBreaking(page.value,pages_size.value,uiddata)) as ResponseBody;
      filteredData.value = response.results;
    }
    async function getuser(uiddata){
      const response = (await HttpManager.getUser(uiddata)) as ResponseBody;
      user.id = response.results.id;
      user.uid = response.results.uid;
      user.tel = response.results.tel;
      user.cnum = response.results.cnum;
      user.pnum = response.results.pnum;
      user.addr = response.results.addr;
      user.integ = response.results.integ;
      user.pwd = response.results.pwd;
    }
    function confirmDeleteVehicle(row) {
      ElMessageBox.confirm("确定要删除这条车辆信息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 用户点击了确定按钮，执行删除车辆操作
        deleteVehicle(row);
      });
    }


    async function deleteVehicle(row) {
      // 删除车辆逻辑，你可以在这里处理删除车辆的操作
      console.log('删除车辆:', row);
      await HttpManager.deletecar(row.id);
      await getcardata(user.id);
    }

    const editVehicleDialogVisible = ref(false);
    const editedVehicleForm = reactive({
      id:"",
      user_id: "",
      cnum: "",
      carum: ""
    });

    // 方法：编辑车辆
    function editVehicle(row) {
      // 将选中行的信息赋值给编辑车辆表单，并打开弹窗
      editedVehicleForm.id = row.id;
      editedVehicleForm.user_id = user.id;
      editedVehicleForm.cnum = row.cnum;
      editedVehicleForm.carum = row.carum;
      editVehicleDialogVisible.value = true;
    }

    // 方法：提交编辑后的车辆信息
    async function submitEditedVehicleForm() {
      // 这里添加实际的提交逻辑
      console.log("提交编辑后的车辆信息:", editedVehicleForm);
      // 关闭编辑车辆弹窗
      const response = (await HttpManager.updatecar(editedVehicleForm)) as ResponseBody;
      editVehicleDialogVisible.value = false;
      if(response.code === 400){
        ElMessage.error(`${response.message}`);
      }else{
        ElMessage.success(`${response.message}`);
      }
      getcardata(user.id);
    }

    function addReport() {
      routerManager(RouterName.breaking, { path: RouterName.breaking });
    }

    async function handleCurrentChange(val) {
          page.value = val;
          await getVehicledata(user.id);
      }

      async function handlevehicleDataChange(val) {
          userpage.value = val;
          await getcardata(user.id);
      }
    return {
      editing,
      user,
      vehicleData,
      filteredData,
      page,
      pages_size,
      handleCurrentChange,
      userpage,
      userpages_size,
      handlevehicleDataChange,
      attachImageUrl: HttpManager.attachImageUrl,
      changeState,
      dataformat,
      submit,
      toggleEdit,
      changePassword,
      addVehicle,
      addReport,
      // 修改密码弹窗相关数据和方法
      passwordDialogVisible,
      passwordForm,
      submitPasswordForm,
      editVehicle,
      deleteVehicle,
      // 新增车辆弹窗相关数据和方法
      vehicleDialogVisible,
      vehicleForm,
      submitVehicleForm,
      confirmDeleteVehicle,
      editVehicleDialogVisible,
      editedVehicleForm,
      submitEditedVehicleForm
    };
  }
});
</script>

<style scoped>
.personal-info {
  max-width: 800px;
  margin: 0 auto;
  text-align: center; /* 将内容居中显示 */
}
.tableinfo{
  max-width: 1000px;
  margin: 0 auto;
  text-align: center; /* 将内容居中显示 */
}
.el-form-item {
  text-align: left; /* 将表单项左对齐 */
}
.container{
  margin-top: 40px;
}
.el-button {
  margin-right: 10px; /* 调整按钮之间的间距 */
}

.vehicle-info,
.report-info {
  margin-top: 20px;
}
</style>
