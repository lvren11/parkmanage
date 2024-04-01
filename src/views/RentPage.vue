<template>
  <div class="parking-rental">
    <h2>停车位租赁</h2>
    <div class="user-info">
      <span class="user-id">用户ID: {{ userId }}</span>
    </div>
    <div class="rental-form">
      <el-form :inline="true" :model="rentalForm" class="form-item">
        <!-- 停车位选择 -->
        <el-form-item label="停车位号">
          <el-select v-model="rentalForm.pnum" placeholder="请选择停车位" :rules="[{ required: true, message: '请选择停车位', trigger: 'change' }]">
            <el-option
              v-for="item in availableParking"
              :key="item.id"
              :label="item.pnum"
              :value="item.pnum"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆选择">
          <el-select v-model="rentalForm.cnum" placeholder="请选择车辆" :rules="[{ required: true, message: '请选择车辆', trigger: 'change' }]">
            <el-option
              v-for="item in availablCar"
              :key="item.id"
              :label="item.cnum"
              :value="item.cnum"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 租赁时间选择 -->
        <el-form-item label="租赁时间">
        </el-form-item>
        <!-- 开始日期 -->
        <el-form-item label="开始日期">
          <el-date-picker v-model="startDate" type="date" placeholder="选择开始日期"></el-date-picker>
        </el-form-item>
        <!-- 结束日期 -->
        <!-- <el-form-item label="结束日期">
          <el-date-picker v-model="endDate" type="date" placeholder="选择结束日期"></el-date-picker>
        </el-form-item> -->
      </el-form>
    </div>
    <el-row class="rental-description">
      <el-col :span="24">
        <div class="rental-description">
          <el-card>
            <p style="color: red;font-size: 18px;">租赁说明<span style="color: orange;margin-left: 20px;">租天：50元/天</span> <span style="color: orange;">租月：300元/月</span><span style="color: orange;">租季：800元/季</span> <span style="color: orange;">租年：2500元/年</span></p>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="rental-description">
          <el-row>
            <el-col :span="6">
              <el-card style="margin-top: 20px;margin-left: 10px;margin-right: 10px;">
                <el-button type="text" @click="handleRentalOptionClick('y')" style="font-size: 18px;">1年 ￥{{ rentalPrice.year }}</el-button>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card style="margin-top: 20px;margin-left: 10px;margin-right: 10px;">
                <el-button type="text" @click="handleRentalOptionClick('j')" style="font-size: 18px;">季 ￥{{ rentalPrice.quarter }}</el-button>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card style="margin-top: 20px;margin-left: 10px;margin-right: 10px;">
                <el-button type="text" @click="handleRentalOptionClick('m')" style="font-size: 18px;">月 ￥{{ rentalPrice.month }}</el-button>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card style="margin-top: 20px;margin-left: 10px;margin-right: 10px;">
                <el-button type="text" @click="handleRentalOptionClick('d')" style="font-size: 18px;">天 ￥{{ rentalPrice.day }}</el-button>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!-- 支付方式 -->
    <div class="rental-description">
      <el-row>
        <el-col :span="12" class="payment-button">
          <el-button type="primary" @click="payByAlipay">支付宝支付{{ paymentAmount }}</el-button>
        </el-col>
        <el-col :span="12" class="payment-button">
          <el-button type="success" @click="payByWechat">微信支付{{ paymentAmount }}</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { HttpManager } from '@/api/index';
import { ElMessage, ElLoading } from 'element-plus';

export default {
  data() {
    const store = useStore();
    return {
      userId: store.state.user.uid,
      id: store.state.user.id,
      rentalForm: {
        id:'',
        pnum: '', // 停车位号
        cnum:''
      },
      startDate: '', // 开始日期
      endDate: '', // 结束日期
      availableParking: [], // 可用停车位列表
      availablCar:[],
      rentalPrice: {
        year: 2500,
        quarter: 800,
        month: 300,
        day: 50,
      },
      renttype:'',
      paymentAmount: 0, // 支付金额
    };
  },
  methods: {
    async rentParking() {
      // 在这里处理租赁操作，发送请求到后端进行支付等操作
      // 注意要根据选择的租赁时间计算租金，可以使用 rentalType 和 startDate、endDate 来计算租金
      // 处理完后可以刷新可用停车位列表
      // 以下是示例代码
      console.log('用户id', this.id);
      console.log('租赁停车位id：', this.findIdByPnum(this.availableParking,this.rentalForm.pnum));
      console.log('租赁停车位：', this.rentalForm.pnum);
      console.log('车辆', this.rentalForm.cnum);
      console.log('租赁类别：', this.renttype);
      console.log('开始日期：', this.startDate);
      // console.log('结束日期：', this.endDate);
      console.log('支付金额：', this.paymentAmount);
      if (!this.rentalForm.pnum || !this.rentalForm.cnum) {
        // 显示错误消息提示用户选择停车位和车辆
        this.$message.error('请选择停车位和车辆');
        return; // 中止方法执行
      }
      if (!['y', 'j', 'm', 'd'].includes(this.renttype)) {
        // 如果租赁类别不在预期的类型之内，显示错误消息提示用户选择正确的选项
        this.$message.error('请选择租赁选项');
        return;
      }
      const res = await HttpManager.Buyparkingspot(this.findIdByPnum(this.availableParking,this.rentalForm.pnum),this.renttype,this.id, this.rentalForm.cnum, this.startDate);
      if(res.code === 200){
        ElMessage.success(`成功支付金额：${this.paymentAmount}元`);
      }else{
        ElMessage.error(`${res.message}`);
      }
      // ElMessage.success(`成功租赁：${res.message}`);
    },
    findIdByPnum(availableParking, targetPnum){
      const foundParking = availableParking.find(parking => parking.pnum === targetPnum);
      return foundParking ? foundParking.id : null;
    },
    handleRentalOptionClick(type) {
      // 处理租赁选项点击事件
      // 在这里你可以根据选项类型计算租金
      console.log('选择租赁选项：', type);
      this.renttype = type;
      switch (type) {
        case 'y':
          this.paymentAmount = this.rentalPrice.year;
          break;
        case 'j':
          this.paymentAmount = this.rentalPrice.quarter;
          break;
        case 'm':
          this.paymentAmount = this.rentalPrice.month;
          break;
        case 'd':
          this.paymentAmount = this.rentalPrice.day;
          break;
        default:
          this.paymentAmount = 0;
      }
    },
    async fetchAvailableParking() {
      try {
        // 这里发送请求获取空闲停车位列表
        // 假设已经从后端接口获取到了数据
        // const fakeData = [
        //   { id: '1', pnum: 'P001' },
        //   { id: '2', pnum: 'P002' },
        //   { id: '3', pnum: 'P003' },
        // ];
        const response = await HttpManager.getAllparkinglot(1,1000,"","");
        this.availableParking = response.results.filter(item => item.pst === 0);
        // this.availableParking = fakeData;
      } catch (error) {
        console.error('Failed to fetch available parking:', error);
      }
    },
    async fetchAvailableCar() {
      try {
        // 这里发送请求获取空闲停车位列表
        // 假设已经从后端接口获取到了数据
        // const fakeData = [
        //   { id: '1', pnum: 'P001' },
        //   { id: '2', pnum: 'P002' },
        //   { id: '3', pnum: 'P003' },
        // ];
        const response = await HttpManager.getMyCar(1,1000,this.id);
        this.availablCar = response.results;
        // this.availableParking = fakeData;
      } catch (error) {
        console.error('Failed to fetch available parking:', error);
      }
    },
    async payByAlipay() {
    // 显示加载状态
    const loadingInstance = ElLoading.service({ fullscreen: true });

    try {
      // 模拟支付处理，等待两秒
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 处理支付宝支付
      console.log('支付宝支付', this.paymentAmount);
      // 弹出成功支付提示
      await this.rentParking();
    } catch (error) {
      console.error('支付处理出错:', error);
      // 弹出错误提示
      // ElMessage.error('支付失败，请稍后重试');
    } finally {
      // 隐藏加载状态
      loadingInstance.close();
    }
  },

  async payByWechat() {
    // 显示加载状态
    const loadingInstance = ElLoading.service({ fullscreen: true });

    try {
      // 模拟支付处理，等待两秒
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 处理微信支付
      console.log('微信支付', this.paymentAmount);
      // 弹出成功支付提示
      await this.rentParking();
    } catch (error) {
      console.error('支付处理出错:', error);
      // 弹出错误提示
    } finally {
      // 隐藏加载状态
      loadingInstance.close();
    }
  },
  },
  mounted() {
    this.fetchAvailableParking(); // 获取可用停车位列表
    this.fetchAvailableCar(); // 获取车列表
    if (this.$route.query.pnum) {
      this.rentalForm.pnum = this.$route.query.pnum;
    }
  },
};
</script>

<style scoped>
.parking-rental {
  margin: 20px;
}
.form-item{
  margin-top: 20px;
}
.user-info {
  float: right;
  margin-right: 20px;
  font-size: 14px;
}
.user-id {
  font-weight: bold;
}
.rental-form {
  margin-bottom: 20px;
}

.rental-description {
  margin-bottom: 20px;
  width: 700px;
}

.rental-options {
  margin-bottom: 20px;
}

.payment-method {
  margin-top: 20px;
}

.payment-button {
  text-align: center;
}
</style>
