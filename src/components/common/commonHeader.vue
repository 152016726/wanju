<template>
  <div class="header clearfix">
    <!-- 左侧的公司名称开始 -->
    <div class="left fl">
      <div class="logo fl"></div>
      <p class="companyName fl">家庭医生签约管理系统</p>
    </div>
    <!-- 左侧的公司名称结束 -->

    <!-- 右侧的个人信息开始 -->
    <div class="right fr">
      <el-dropdown>
        <div class="el-dropdown-link">
          <img class="avatar" :src="!!headImgFileId ? downloadUrl + headImgFileId : defaultAvatar"/>
          <span>{{role.roleName}}，欢迎您回来！</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--<el-dropdown-item>-->
            <!--<div class="item">-->
              <!--<div class="icon"></div>-->
              <!--<div class="changePwd" @click="toggleReset">修改密码</div>-->
            <!--</div>-->
          <!--</el-dropdown-item>-->
          <el-dropdown-item>
            <div class="item">
              <div class="icon"></div>
              <div class="changePwd" @click="exitPage">退出</div>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 右侧的个人信息开始 -->

    <!-- 修改密码弹窗开始 -->
    <assignAlertDialog
      :title="'修改密码'"
      :isShowDialog="isShowReset"
      :toggleContent="toggleReset"
      :confirmDialog="submitReset"
    >
      <div class="resetPwd">

        <commonTextInput
          :text="'原始密码'"
          v-model="originPwd"
        >
        </commonTextInput>

        <commonTextInput
          :text="'新密码'"
          v-model="newPwd"
          :errorTips="'必须包含数字和字母，长度8-16位'"
          :rexpRule="/^[0-9A-Za-z]{8,16}$/"
        >
        </commonTextInput>

        <commonTextInput
          :text="'确认密码'"
          v-model="confirmPwd"
          :errorTips="'两次输入密码不一致'"
          :errorState="errorState"
        >
        </commonTextInput>

      </div>
    </assignAlertDialog>
    <!-- 修改密码弹窗结束 -->
  </div>
</template>

<script>
  import assignAlertDialog from '@/components/assignAlertDialog';
  import commonTextInput from '@/components/common/commonTextInput';

  export default {
    name: "commonHeader",
    components: {
      assignAlertDialog,
      commonTextInput
    },
    data() {
      return {
        isShowReset: false,         // 是否展示重置密码
        originPwd: '',              // 原始密码
        newPwd: '',                 // 新密码
        confirmPwd: '',              // 确认密码
        errorState: false,           // 错误状态
        headImgFileId: '',           // 头像ID
        downloadUrl: this.$downloadUrl, // 下载路径
        defaultAvatar: this.$defaultAvatar,
        role:{}                      // 角色信息
      }
    },
    watch: {
      newPwd(val) {
        if (val !== this.confirmPwd) {
          this.errorState = true;
        } else {
          this.errorState = false;
        }
      },
      confirmPwd(val) {
        if (val !== this.newPwd) {
          this.errorState = true;
        } else {
          this.errorState = false;
        }
      },
      statusSet(val){
        if(val){
          this.initData()
        }
      }
    },
    computed:{
      statusSet(){
        return this.$store.state.isLogin
      }
    },
    methods: {
      /**
       * 开关重置密码窗口
       * @param fag
       */
      toggleReset(fag) {
        if (fag === -1) {
          this.isShowReset = false;
        } else {
          this.isShowReset = !this.isShowReset;
        }
      },
      /**
       * 确认充值密码
       */
      submitReset() {
        // console.log('重置密码');
        this.toggleReset(-1)
      },
      /**
       * 退出登录
       */
      exitPage() {
        this.$confirm('是否退出登录?', '消息提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
          this.$localStore.removeItem('auth-token');
          this.$localStore.removeItem('authority');
          this.$localStore.removeItem('info');
          this.$localStore.removeItem('role');
          location.reload()
        })

      },
      initData(){
        let info = JSON.parse(this.$localStore.getItem('role'));
        if(!!JSON.parse(this.$localStore.getItem('info'))){
          let headImgFileId = JSON.parse(this.$localStore.getItem('info')).headImgFileId;
          // 头像图片
          if(headImgFileId)this.headImgFileId = headImgFileId;
        }
        if(!!info) this.role = info;
      }
    },
    created() {
      this.initData()
    }
  }
</script>

<style lang="scss">
@import "../../style/commonHeader.scss";
</style>
