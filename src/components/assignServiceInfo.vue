<template>
  <div class="assignServiceInfo">
    <!-- 签约弹窗头部横栏开始 -->
    <div class="assignDialogTitle">
      <span>签约详情</span>
      <div class="closeIcon" @click.stop="closeContent">&times;</div>
    </div>
    <!-- 签约弹窗公共横栏结束 -->
    <div class="assignServiceContent">
      <p class="contentTitle">签约人：{{signer}}</p>
      <div class="servicePackages">
        <p class="assignSignerTitle">
          <span class="title">{{serviceInfo.FWBMC}}</span>
        </p>
        <table class="serviceTable">
          <tbody>
          <tr class="serviceThead">
            <th class="serviceTableCell index">序号</th>
            <th class="serviceTableCell categories">项目分类</th>
            <th class="serviceTableCell serviceTimes">服务次数</th>
            <th class="serviceTableCell serviceExplain">服务内容解释</th>
            <th class="serviceTableCell serviceRemark">备注</th>
          </tr>
          <tr class="serviceColumn" v-for="(item,index) in serviceInfo.FWXMLBList" :key="index">
            <td class="serviceTableCell">
              <div>{{index+1}}</div>
            </td>
            <td class="serviceTableCell">
              {{item.FWXMMC}}
            </td>
            <td class="serviceTableCell">
              <div>{{item.FWCS}}</div>
            </td>
            <td class="serviceTableCell">
              <div>{{item.FWXMMS}}</div>
            </td>
            <td class="serviceTableCell"></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "assignServiceInfo",
    data() {
      return {}
    },
    props: {
      serviceInfo: {
        default: () => {
        }
      },          // 服务详情
      signer: '',                              // 签约人
      toggleMainContent: {},                   // 内容的显示隐藏切换函数
    },
    methods: {
      /**
       * 关闭弹窗
       */
      closeContent() {
        this.toggleMainContent(-1)
      }
    }
  }
</script>

<style lang="scss">
  @import "../style/assignServiceInfo.scss";
</style>
