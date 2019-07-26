<template>
  <div class="assignBaseInfo" :class="{borderBottom: isShowBorder}">
    <div class="assignBaseHeader">
      <p class="assignBaseInfoTitle">基本资料</p>
      <!--<el-button type="primary" class="major" v-if="!isDisabled" @click.prevent.stop="changeEditState">{{isEditInfo ?-->
        <!--'编辑' : '保存'}}-->
      <!--</el-button>-->
    </div>
    <!-- 个人信息开始 -->
    <div class="assignBaseInfoInput clearfix">
      <div class="col-1 item fl">
        <commonTextInput v-model="JDJGMC" :text="'建档单位'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="YHZGXMC" :text="'关系'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="XB" :text="'性别'" :isDisabled="true" :placeholderText="''"></commonTextInput>
        <commonTextInput v-model="HYZKMC" :text="'婚姻状况'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
      </div>
      <div class="col-2 item fl">
        <commonTextInput v-model="GDJGMC" :text="'存档单位'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="XM" :text="'居民姓名'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="BRDHHM" :text="'手机号码'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="ZYMC" :text="'职业'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
      </div>
      <div class="col-3 item fl">
        <commonTextInput v-model="JDRMC" :text="'建档人'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="SFZJH" :text="'身份证号'" :isDisabled="isEditInfo || isDisabled" :errorTips="'身份证号码格式错误'"
                         :errorState="SFZJHState"></commonTextInput>
        <commonTextInput v-model="MZMC" :text="'民族'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="XM" :text="'签约人姓名'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
      </div>
      <div class="col-4 item fl">
        <commonTextInput v-model="ZRYSMC" :text="'责任医生'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="bornDate" :text="'出生日期'" :isDisabled="true" :placeholderText="''"></commonTextInput>
        <commonTextInput v-model="ABOMC" :text="'血型'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="DAZGZTDMMC" :text="'档案转归状态'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
      </div>
    </div>
    <!-- 个人信息结束 -->

    <!-- 个人地址开始 -->
    <div class="contentAddress">
      <commonAreaSelector
        :text="'户籍地址'"
        :province.sync="isEditInfo || isDisabled ? HJDZPROVINCEDNAME : HJDZPROVINCEDID"
        :city.sync="isEditInfo || isDisabled ? HJDZCITYNAME : HJDZCITYID"
        :area.sync="isEditInfo || isDisabled ? HJDZDISTRICTNAME : HJDZDISTRICTID"
        :street.sync="isEditInfo || isDisabled ? HJDZSTREETNAME : HJDZSTREETID"
        :village.sync="isEditInfo || isDisabled ? HJDZCOMMITTEENAME : HJDZCOMMITTEEID"
        :address.sync="HJDZXXDZ"
        :isDisabled="isEditInfo || isDisabled"
      >
      </commonAreaSelector>

      <commonAreaSelector
        :text="'现住地址'"
        :province.sync="isEditInfo || isDisabled ? XZZPROVINCEDNAME : XZZPROVINCEDID"
        :city.sync="isEditInfo || isDisabled ? XZZCITYNAME : XZZCITYID"
        :area.sync="isEditInfo || isDisabled ? XZZDISTRICTNAME : XZZDISTRICTID"
        :street.sync="isEditInfo || isDisabled ? XZZSTREETNAME : XZZSTREETID"
        :village.sync="isEditInfo || isDisabled ? XZZCOMMITTEENAME : XZZCOMMITTEEID"
        :address.sync="XZZXXDZ"
        :isDisabled="isEditInfo || isDisabled"
      >
      </commonAreaSelector>

      <commonAreaSelector
        :text="'网格地址'"
        :province.sync="isEditInfo || isDisabled ? XZZPROVINCEDNAME : XZZPROVINCEDID"
        :city.sync="isEditInfo || isDisabled ? XZZCITYNAME : XZZCITYID"
        :area.sync="isEditInfo || isDisabled ? XZZDISTRICTNAME : XZZDISTRICTID"
        :street.sync="isEditInfo || isDisabled ? XZZSTREETNAME : XZZSTREETID"
        :village.sync="isEditInfo || isDisabled ? XZZCOMMITTEENAME : XZZCOMMITTEEID"
        :address.sync="XZZXXDZ"
        :isDisabled="isEditInfo || isDisabled"
      >
      </commonAreaSelector>

    </div>
    <!-- 个人地址结束 -->

    <!-- 个人病史开始 -->
    <div class="assignPersonInfo">
      <p class="assignPersonInfoTitle">个人病史</p>
      <div class="illnessHistory">
        <commonTextInput v-model="YWGMSMC" :text="'过敏史'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="BLSLBMC" :text="'暴露史'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
      </div>
      <commonTextInput v-model="CJQKLBMC" :text="'残疾情况'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
    </div>
    <!-- 个人病史结束 -->

    <!-- 家族病史开始 -->
    <div class="assignHomeInfo">
      <p class="assignHomeInfoTitle">家族病史</p>
      <div class="assignHomeContent">
        <commonTextInput v-model="JZSFQJBLBMC" :text="'父亲病史'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="JZSMQJBLBMC" :text="'母亲病史'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="JZSXDJMJBLBMC" :text="'兄弟姐妹病史'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="JZSZNJBLBMC" :text="'儿女病史'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
        <commonTextInput v-model="YCSJBDMMC" :text="'遗传病史'" :isDisabled="isEditInfo || isDisabled"></commonTextInput>
      </div>
    </div>
    <!-- 家族病史结束 -->

  </div>
</template>

<script>
  import commonTextInput from './common/commonTextInput';             // 公共输入框
  import commonAreaSelector from './common/commonAreaSelector';       // 地址选择
  import commonDatePicker from './common/commonDatePicker';            // 日期选择
  import {identityCodeValid} from '@/common/js/util';          // 身份证获取生日年龄方法
  export default {
    name: "assignBaseInfo",
    components: {
      commonTextInput,
      commonAreaSelector,
      commonDatePicker
    },
    data() {
      return {
        isEditInfo: true,             // 是否可以编辑信息
        JKDAID: '',                   // 健康档案Id
        JDJGMC: '',                   // 建档单位
        YHZGXMC: '',                  // 关系
        XB: '',                       // 性别
        HYZKMC: '',                   // 婚姻状况
        GDJGMC: '',                   // 存档单位
        XM: '',                       // 居民姓名
        BRDHHM: '',                   // 手机号码
        ZYMC: '',                     // 职业
        JDRMC: '',                    // 建档人
        SFZJH: '',                    // 身份证号
        MZMC: '',                     // 民族
        signName: '',                 // 签约人姓名
        ZRYSMC: '',                   // 责任医生
        bornDate: '',                 // 出生日期
        ABOMC: '',                    // 血型
        DAZGZTDMMC: '',               // 档案转归状态
        SFZJHState: false,            // 身份证输入状态
        YWGMSMC: '',                  // 过敏史
        BLSLBMC: '',                  // 暴露史
        pastMedicalHistory: '',       // 既往史
        illnessName: '',              // 疾病名称
        approvalDate: '',             // 确诊时间
        clinicHospital: '',           // 就诊医院
        CJQKLBMC: '',               // 残疾情况
        JZSFQJBLBMC: '',              // 父亲病史
        JZSMQJBLBMC: '',              // 母亲病史
        JZSXDJMJBLBMC: '',            // 兄弟姐妹病史
        JZSZNJBLBMC: '',              // 儿女病史
        YCSJBDMMC: '',                // 遗传病史
        XZZPROVINCEDID: '',           // 现住址省ID
        XZZPROVINCEDNAME: '',         // 现住址省
        XZZCITYID: '',                // 现住址市ID
        XZZCITYNAME: '',              // 现住址市
        XZZDISTRICTID: '',            // 现住址区ID
        XZZDISTRICTNAME: '',          // 现住址区
        XZZCOMMITTEEID: '',           // 现住址村ID
        XZZCOMMITTEENAME: '',         // 现住址村
        XZZSTREETID: '',              // 现住址街道ID
        XZZSTREETNAME: '',            // 现住址街道
        XZZXXDZ: '',                  // 现住址详细地址
        HJDZPROVINCEDID: '',          // 户籍地址省ID
        HJDZPROVINCEDNAME: '',        // 户籍地址省
        HJDZCITYID: '',               // 户籍地址市ID
        HJDZCITYNAME: '',             // 户籍地址市
        HJDZDISTRICTID: '',           // 户籍地址区ID
        HJDZDISTRICTNAME: '',         // 户籍地址区
        HJDZSTREETID: '',             // 户籍地址街道ID
        HJDZSTREETNAME: '',           // 户籍地址街道
        HJDZCOMMITTEEID: '',          // 户籍地址村ID
        HJDZCOMMITTEENAME: '',        // 户籍地址村
        HJDZXXDZ: ''                  // 户籍地址详细地址
      }
    },
    watch: {
      // 检测身份证号码
      SFZJH(val) {
        let pass = identityCodeValid(val);
        this.SFZJHState = !pass.pass;
        if (pass.pass) {
          const {age, sex, birthDate} = pass.more;
          this.XB = sex;
          this.bornDate = birthDate;
        }
      }
    },
    props: {
      isShowBorder: {default: true},
      memberInfo: {
        default: () => {
        }
      },      // 成员信息
      isDisabled: {default: true}
    },
    created() {
      Object.assign(this, this.memberInfo)
    },
    methods: {
      /**
       * 编辑/保存健康档案
       */
      changeEditState() {
        const {JKDAID} = this;
        this.isEditInfo = !this.isEditInfo;
        // 如果是点击的保存
        if(this.isEditInfo){
          this.$post('family/sign/order/updateSignHealth', {JKDAID, }).then(rsp=>{

          }, rej=>{
            if(rej.data.errcode === 460){
              this.$message.error(rej.data.datas[0].message);
            }else{
              this.$message.error(rej.data.errmsg);
            }}
          )
        }
      }
    }
  }
</script>

<style lang="scss">
@import "../style/assignBaseInfo.scss";
</style>
