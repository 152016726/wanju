<template>
  <div class="assignMember">
    <div class="assignMemberInfo clearfix">
      <img class="memberAvatar fl" :src="memberInfo.GRTXWJID ? downloadUrl+memberInfo.GRTXWJID : memberInfo.XB === '男性' ? man : woman"/>
      <div class="memberInfo fl">
        <p class="info"><span class="name">{{memberInfo.XM}}</span> <i class="gender">{{memberInfo.XB}}</i></p>
        <div class="idCardNum">{{memberInfo.SFZJH}}</div>
      </div>
    </div>
    <div class="memberType">{{memberInfo.YHZGXMC}}</div>
    <!--<div class="closeMemberDialog" v-if="isClose" @click="closeDialog">&times;</div>-->
  </div>
</template>

<script>
  export default {
    name: "assignMember",
    data() {
      return {
        downloadUrl: this.$downloadUrl,                // 下载路径
        man: this.$defaultManImg,                     //  默认男士头像
        woman: this.defaultWomanImg                   // 默认女士头像
      }
    },
    props: {
      isClose: {default: true},
      memberInfo: {
        default: () => {
        }
      }
    },
    methods: {
      closeDialog() {

      }
    }
  }
</script>

<style lang="scss">
@import "../style/assignMember.scss";
</style>
