<template>
  <div class="assignSigner">
    <p class="assignSignerTitle">
      <span class="title">{{title}}</span>
      <!--<el-button type="primary" class="major" v-if="!isDisabledSign" @click.prevent.stop="changeEditState">{{isEditInfo ? '编辑' : '保存'}}</el-button>-->
      <el-button type="info" v-if="ORDERSTATUS === 2" plain disabled class="major refused">已拒绝</el-button>
      <el-button type="info" v-if="ORDERSTATUS === 3" plain disabled class="major canceled">已取消</el-button>
      <el-button type="info" v-if="ORDERSTATUS === 4" plain disabled class="major retracted">已解约</el-button>
      <el-button type="info" v-if="ORDERSTATUS === 5" plain disabled class="major overTimed">已过期</el-button>
      <el-button type="danger" class="major cancel" v-if="!isDisabledSign && ORDERSTATUS === 1" @click.prevent.stop="toggleTerminateDialog">解约
      </el-button>
    </p>
    <div class="baseInfo">
      <commonTextInput :text="'关系'" v-model="YHZGXMC" :isDisabled="isEditInfo || isDisabledSign"></commonTextInput>
      <commonTextInput :text="'居民姓名'" v-model="XM" :isDisabled="isEditInfo || isDisabledSign"></commonTextInput>
      <commonTextInput :text="'身份证号'" v-model="SFZJH" :errorTips="'身份证号码格式错误'" :errorState="SFZJHState" :isDisabled="isEditInfo || isDisabledSign"></commonTextInput>
      <commonTextInput :text="'出生日期'" v-model="bornDate" :isDisabled="true" :placeholderText="''" ></commonTextInput>
    </div>
    <div class="privateInfo">
      <commonTextInput :text="'性别'" v-model="XB" :isDisabled="true" :placeholderText="''" ></commonTextInput>
      <commonTextInput :text="'年龄'" v-model="age" :isDisabled="true" :placeholderText="''" ></commonTextInput>
      <commonTextInput :text="'手机号码'" v-model="BRDHHM" :isDisabled="isEditInfo || isDisabledSign"></commonTextInput>
    </div>
    <div class="personCategory">
      <div class="category">人群分类</div>
      <el-checkbox-group v-model="checkList" :disabled="isEditInfo || isDisabledSign">
        <el-checkbox v-for="(item, index) in categoryList" :label="item.RQFLID" :key="index">
          {{item.RQFLMC}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="signServicePackage">
      <span class="signPackages">签约服务包</span>
      <span class="serviceType" v-for="(item, index) in signerInfo.FWBLBList" :key="index" @click.prevent.stop="serviceClick(item)">
        <span class="info">{{item.FWBMC}}</span>
      </span>
    </div>
    <div class="serviceItems">
      <span class="itemsTitle">服务项目</span>
      <div class="items">
        <div class="item" v-for="(item, index) in FWXMLBList" :key="index">{{item.FWXMMC}}</div>
      </div>
    </div>
    <!-- 服务详情开始 -->
    <commonDialog
      :toggleMainContent='toggleMainContent'
      :show='isShowChargeInfo'
      :isShowText='false'
    >
      <assignServiceInfo
        :toggleMainContent='toggleMainContent'
        :serviceInfo="serviceInfo"
        :signer="XM"
      >
      </assignServiceInfo>
    </commonDialog>
    <!-- 服务详情结束 -->
    <!-- 解约弹窗开始 -->
    <assignAlertDialog
      :title="'解约'"
      :isShowDialog="isShowTerminate"
      :toggleContent="toggleTerminateDialog"
      :confirmDialog="retractFile"
    >
      <div class="paddingBox nonePaddingBottom">
        <commonTextArea v-model="JYYY" :text="'解约原因'"></commonTextArea>
      </div>
    </assignAlertDialog>
    <!-- 解约弹窗结束 -->
  </div>
</template>

<script>
  import commonTextInput from './common/commonTextInput';
  import commonDatePicker from './common/commonDatePicker';
  import commonDialog from './common/commonDialog';                             // 公共弹窗
  import assignServiceInfo from './assignServiceInfo';                  // 签约详情弹窗
  import {identityCodeValid} from '@/common/js/util';          // 身份证获取生日年龄方法
  import assignAlertDialog from './assignAlertDialog';                  // 通过/拒绝弹窗组件
  import commonTextArea from './common/commonTextArea';

  export default {
    name: "assignSigner",
    components: {
      commonTextInput,
      commonDatePicker,
      assignServiceInfo,
      assignAlertDialog,
      commonTextArea,
      commonDialog
    },
    data() {
      return {
        isEditInfo: true,                // 是否可以编辑信息
        isShowChargeInfo: false,          // 费用明细弹窗
        isShowTerminate: false,               // 是否展示解约窗口
        JYYY: '',                        // 解约原因
        YHZGXMC: '',                     // 关系
        XM: '',                           // 居民姓名
        SFZJH: '',                       // 身份证
        bornDate: '',                     // 出生日期
        XB: '',                          // 性别
        age: '',                          // 年龄
        BRDHHM: '',                        // 手机号码
        checkList: [],                    // 人群分类
        SFZJHState: false,               // 身份证输入状态
        serviceInfo: {},
        QYMXID: '',                      // 签约明细ID
        ORDERSTATUS: 0,                  // 签约状态 0代表待审核，1代表已签约，2代表已拒绝，3已取消，4已解约，5已过期
        FWXMLBList: []                   // 服务项目列表List
      }
    },
    props: {
      title:{default: ''},                   // 标题
      QYID:{default: ''},                   // 签约ID
      index:{default: ''},                  // 索引
      orderStatus: {default: ''},           // 签约状态
      categoryList: {default: ()=> []},     // 人群分类List
      signerInfo: {default: ()=>{}},        // 签约人信息
      isDisabledSign: {default: true}       // 是否不能输入
    },
    watch:{
      // 检测身份证号码
      SFZJH(val){
        let pass = identityCodeValid(val);
        this.SFZJHState = !pass.pass;
        if(pass.pass){
          const {age, sex, birthDate} = pass.more;
          this.XB = sex;
          this.bornDate = birthDate;
          this.age = age;
        }
      },
      // 检测签约状态的改变
      orderStatus(){
        this.initData()
      }
    },
    methods: {
      /**
       * 开关是否解约小弹窗
       * @param fag type:string
       **/
      toggleTerminateDialog(fag) {
        if (fag === -1) {
          this.isShowTerminate = false;
        } else {
          this.isShowTerminate = !this.isShowTerminate;
        }
      },
      /**
       * 费用明细弹窗的隐藏与显示
       * @param fag
       */
      toggleMainContent(fag) {
        if (fag === -1) {
          this.isShowChargeInfo = false;
        } else {
          this.isShowChargeInfo = !this.isShowChargeInfo;
        }
      },
      /**
       * 编辑与确认
       */
      changeEditState(){
        this.isEditInfo = !this.isEditInfo;
      },
      /**
       * 服务包点击事件
       * @param item  type: object
       */
      serviceClick(item){
        this.serviceInfo = item;
        this.FWXMLBList = item.FWXMLBList;
        this.toggleMainContent()
      },
      /**
       * 解约当前用户
       */
      retractFile(){
        const {QYID, QYMXID, JYYY} = this;
        this.$post('family/sign/order/cancelSignMember', {
          QYID, QYMXID, JYYY
        }).then(rsp=>{
          this.ORDERSTATUS = 4;
          this.toggleTerminateDialog();
          if(this.index === 0){
            // this.$emit('initData');
            this.$emit('setSignStatus', 4);
            this.$emit('closeDialog');
          }
        }, rej=>{
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }
        })
      },
      /**
       * 初始化数据
       */
      initData(){
        Object.assign(this, this.signerInfo);
        // 赋值已选的人群分类
        this.checkList = this.signerInfo.FWRQFLLBList.map(item=>{
          return item.RQFLID
        });
        this.FWXMLBList = this.signerInfo.FWBLBList[0].FWXMLBList;
      }
    },
    created(){
      this.initData();
    }
  }
</script>

<style lang="scss">
  @import "../style/assignSigner.scss";
</style>
