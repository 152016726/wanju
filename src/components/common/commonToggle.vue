<template>
  <div class="servicePackages">
    <div class="assignSignerTitle" :class="{borderActive: isExpandBox, borderTop: isFirst, borderNone: isHideBorder}" @click.prevent.stop="toggleServicePackages">
      <span class="title">
        {{title}}
      </span>
      <i class="icon" :class="{pull: isExpandBox}"></i>
    </div>
    <div class="servicePackagesContent" v-if="isExpandBox">
      <slot/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "commonToggle",
    data() {
      return {
        isExpandBox: false
      }
    },
    props:{
      title: {default: ''},                 // 标题
      isHideBorder: {default: false},       // 是否隐藏边框
      isFirst: {default: false},            // 是否为第一个
      isDefaultShow: {default: false}       // 默认是否展示
    },
    methods: {
      /**
       * 开关服务包的展开
       */
      toggleServicePackages() {
        this.isExpandBox = !this.isExpandBox;
      }
    },
    created(){
      this.isExpandBox = this.isDefaultShow;  // 默认初始化
    }
  }
</script>

<style lang="scss">
@import '../../style/commonToggle.scss';
</style>
