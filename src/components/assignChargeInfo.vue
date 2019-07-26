<template>
  <commonDialog
    :toggleMainContent='toggleMainContent'
    :show='isShow'
    :isShowText = 'false'
  >
  <div class="assignChargeInfo">
    <!-- 费用明细头部横栏开始 -->
    <div class="assignDialogTitle">
      <span>费用明细</span>
      <div class="closeIcon" @click.stop="closeContent">&times;</div>
    </div>
    <!-- 费用明细头部横栏结束 -->
    <div class="assignChargeContent">
      <div class="chargeInfo">
        <p class="chargeInfoTitle">
          <span class="title">一般人群收费服务包</span>
        </p>
        <div class="chargeTable">
          <div class="chargeColumn">
            <div class="chargeTableCell">服务包费用</div>
            <div class="chargeTableCell">60元</div>
          </div>
          <div class="chargeColumn">
            <div class="chargeTableCell">服务包费用</div>
            <div class="chargeTableCell">60元</div>
          </div>
          <div class="chargeColumn">
            <div class="chargeTableCell">服务包费用</div>
            <div class="chargeTableCell">60元</div>
          </div>
          <div class="chargeColumn">
            <div class="chargeTableCell">服务包费用</div>
            <div class="chargeTableCell">60元</div>
          </div>
        </div>
      </div>
      <div class="chargeInfo">
        <p class="chargeInfoTitle">
          <span class="title">高血压患者收费服务包</span>
        </p>
        <div class="chargeTable">
          <div class="chargeColumn">
            <div class="chargeTableCell">服务包费用</div>
            <div class="chargeTableCell">60元</div>
          </div>
          <div class="chargeColumn">
            <div class="chargeTableCell">服务包费用</div>
            <div class="chargeTableCell">60元</div>
          </div>
          <div class="chargeColumn">
            <div class="chargeTableCell">服务包费用</div>
            <div class="chargeTableCell">60元</div>
          </div>
          <div class="chargeColumn">
            <div class="chargeTableCell">服务包费用</div>
            <div class="chargeTableCell">60元</div>
          </div>
        </div>
      </div>
      <p class="chargeInfoTitle charge">
        <span class="title">个人合付：40元</span>
      </p>
    </div>

  </div>
  </commonDialog>
</template>

<script>
  import commonDialog from './common/commonDialog';                             // 公共弹窗
  export default {
    name: "assignChargeInfo",
    data() {
      return {}
    },
    components:{
      commonDialog
    },
    props:{
      chargeInfo: {default: ()=>{}}, // 付费信息
      isShow: {default: false},
      toggleMainContent: {},        // 内容的显示隐藏切换函数
    },
    methods:{
      /**
       * 关闭弹窗
       */
      closeContent() {
        this.toggleMainContent(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../style/assignChargeInfo.scss";
</style>
