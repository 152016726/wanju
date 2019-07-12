<template>
  <div id="app">
    <!-- 整个盒子开始 tips:因为element-ui特性必须写个行业样式它自己视为属性，写css会报错 ╮(╯▽╰)╭ -->
    <el-container class="homePage">

      <!-- 公用头部开始 tips:好讨厌饿了么自动给我加的行内样式 -->
      <el-header style="height: auto" v-show="isLogin">
        <commonHeader></commonHeader>
      </el-header>
      <!-- 公用头部结束 -->

      <el-main class="clearfix">

        <!-- 公共左侧栏开始 -->
        <div class="asside fl" v-show="isLogin">
          <asside></asside>
        </div>
        <!-- 公共左侧栏结束 -->

        <!-- 内容部分开始 -->
        <div class="content fr" :class="{fullScreen: !isLogin}">
          <router-view/>
        </div>
        <!-- 内容部分结束 -->

      </el-main>

    </el-container>
    <!-- 整个盒子结束 -->
  </div>
</template>

<script>
  // 公共头部组件
  import commonHeader from './components/commonHeader';
  // 公共侧边栏
  import asside from './components/asside';
  import {mapState} from 'vuex'

  export default {
    name: 'App',
    components: {
      commonHeader,
      asside
    },
    computed: {
      ...mapState([
        'isLogin'
      ])
    }
  }
</script>

<style lang="scss">
  @import "./common/css/common.scss";
  @import "./common/css/media.css";
  #app {
    .homePage{
      min-height: 100vh;
    }
    .el-container {
      min-height: 100%;
      .el-header{
        padding: 0 0 !important;
      }
      .el-main {
        margin: 0 0;
        padding: 0 0;
        display: flex;
        min-height: calc(100vh - 60px);
      }
      .asside{
        width: 10.65%;
        background-color: #304156;
      }
      .content{
        width: 89.35%;
        background-color: #F0F2F5;
      }
      .fullScreen{
        width: 100%;
      }
    }
  }
</style>
