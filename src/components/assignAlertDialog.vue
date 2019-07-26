<template>
  <commonDialog
    :toggleMainContent='toggleContent'
    :show='isShowDialog'
    :isShowText = 'false'
  >
    <div class="assignAlertDialog">
      <!-- 弹窗头部开始 -->
      <div class="assignDialogTitle">
        <span>{{title}}</span>
        <div class="closeIcon" @click.stop.prevent="closeContent">&times;</div>
      </div>
      <!-- 弹窗头部结束 -->
      <div class="assignDialogContent">
        <slot/>
      </div>

      <!-- 弹窗底部开始 -->
      <div class="assignDialogFooter" v-if="isShowFooter" :class="{alignCenter: isCenter, alignLeft: !isCenter,}" :style="{'text-indent':textIndent}">
        <el-button type="primary" class="major" @click.stop.prevent="checkDialog">确定</el-button>
        <el-button type="info" class="info" @click.stop.prevent="cutOffDialog">取消</el-button>
      </div>
      <!-- 弹窗底部结束 -->
    </div>
  </commonDialog>
</template>

<script>
  import commonDialog from './common/commonDialog';

  export default {
    name: "assignAlertDialog",
    components: {
      commonDialog
    },
    props: {
      title: {default: '签约详情'},             // 标题
      isShowDialog: {default: false},            // 是否显示弹窗
      toggleContent: {},                         // 开关弹窗
      confirmDialog: {},                        // 确定
      isCenter: {default: true},                // 是否居中
      textIndent: {default: 0},
      isShowFooter: {default: true}             // 是否展示底部
    },
    methods: {
      /**
       * 关闭弹窗
       */
      closeContent() {
        this.toggleContent(-1)

      },
      /**
       * 确定按钮
       */
      checkDialog(){
        this.confirmDialog();
      },
      /**
       * 取消按钮
       */
      cutOffDialog(){
        this.toggleContent(-1);
        this.$emit('cancelDialog')
      }
    },
    mounted() {
      // 阻止el-button 在body层输入enter时自动触发el-button所绑定的事件
      document.onkeydown=e=>{
        let _key = window.event.keyCode;
        if(_key === 13){
          return false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../style/assignAlertDialog.scss";
</style>
