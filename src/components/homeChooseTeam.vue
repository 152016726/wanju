<template>
  <assignAlertDialog
    :title="'选择团队'"
    :isShowDialog="isShow"
    :toggleContent="toggleContent"
    :isShowFooter="false"
  >
    <div class="homeChooseTeam">
      <div class="signTable">
        <div class="tableHeader">
          <div class="tableCell index">序号</div>
          <div class="tableCell organization">机构名称</div>
          <div class="tableCell teamName">团队名称</div>
          <div class="tableCell code">团队编码</div>
          <div class="tableCell handle">操作</div>
        </div>
        <div class="tableRow">
          <div class="tableCell index">
            <div>1</div>
          </div>
          <div class="tableCell organization">
            <div>aodhadadaads</div>
          </div>
          <div class="tableCell teamName">
            <div>sadawdasdasd</div>
          </div>
          <div class="tableCell code">
            <div>大叔大婶多所</div>
          </div>
          <div class="tableCell handle">
            <el-button type="primary" class="major" @click.stop.prevent="searchBtn">查询</el-button>
          </div>
        </div>
      </div>
    </div>
  </assignAlertDialog>

</template>

<script>
  import assignAlertDialog from './assignAlertDialog';

  export default {
    name: "homeChooseTeam",
    components: {
      assignAlertDialog
    },
    data() {
      return {}
    },
    props: {
      isShow: {default: false},
      toggleContent: {}
    },
    methods: {
      /**
       * 点击查询按钮的操作
       */
      searchBtn(){
        this.toggleContent(-1)
      }
    }

  }
</script>

<style lang="scss">
 @import "../style/homeChooseTeam.scss";
</style>
