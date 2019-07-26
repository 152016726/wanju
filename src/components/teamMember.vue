<template>
  <div class="teamMember">
    <label role="checkbox" class="memberSelect">
      <div class="teamMemberItem" :class="{border: msg}">
        <img :src="dataObj.headImgFileId ? downloadUrl + dataObj.headImgFileId : dataObj.sexName === '男性' ? man : women" :alt="dataObj.doctorName" class="avatar">
        <span class="doctorName">{{dataObj.doctorName}}</span>
        <span class="gender">{{dataObj.sexName}}</span>
        <span class="doctorType">{{dataObj.posTitleName}}</span>
      </div>
      <!--<input type="checkbox" class="checkbox" v-model="msg">-->
      <el-checkbox v-model="msg" class="checkbox"></el-checkbox>
    </label>

  </div>
</template>

<script>

  export default {
    name: "teamMember",
    data() {
      return {
        msg: '',
        women: this.defaultWomanImg,
        man: this.$defaultManImg,
        downloadUrl: this.$downloadUrl,                // 下载路径
      }
    },
    props: {
      type:{default: ''},
      teamId: {default: ''},
      dataObj: {default: ()=>{}}
    },
    watch:{
      msg(){
        const {doctorId, doctorName} = this.dataObj;
        this.$emit('clickItem', {
          doctorId,
          TDID: this.teamId,
          TDJSDM: this.type
        })
      }
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  @import "../style/teamMember.scss";
</style>
