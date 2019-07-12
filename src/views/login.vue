<template>
  <div class="login">
    <div class="loginDialog">
      <h1>家庭医生签约管理系统</h1>
      <form action="">
        <input type="password" v-if="false">
        <div class="loginBox">
          <div class="input">
            <commonInput
              v-model="account"
              :inputImg="accountOff"
              :inputing="accountOn"
              :placeholderText="'请输入账号'"
            >
            </commonInput>
          </div>
          <div class="input">
            <commonInput
              v-model="password"
              :inputImg="lock"
              :inputing="unlock"
              :isPwd="true"
              :placeholderText="'请输入密码'"
            >
            </commonInput>
          </div>
          <div class="input verifyCode">
            <commonInput
              v-model="imgCode"
              :inputImg="codeOff"
              :inputing="codeOn"
              :isPwd="false"
              :placeholderText="'请输入验证码'"
              @submitData="submitData"
            >
            </commonInput>
            <img :src="imgCodeSrc" alt="验证码" class="imgCode" @click.prevent.stop="reGetCodeImg">
            <a href="#" class="exchangeImg" @click.prevent.stop="reGetCodeImg">换一张</a>
          </div>
          <div class="errorTips" v-if="errorState">{{errorTips}}</div>
          <div class="choosed">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </div>
          <a href="#" class="loginBtn" :class="{active: account && password && imgCode}" @click.prevent.stop="submitData">
            登陆系统
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import commonInput from '@/components/commonInput';
  import accountOff from '@/assets/accountOff.png';
  import accountOn from '@/assets/accountOn.png';
  import lock from '@/assets/ic_lock_off.png';
  import unlock from '@/assets/ic_lock_on.png';
  import codeOff from '@/assets/ic_testing_off.png';
  import codeOn from '@/assets/ic_testing_on.png';
  import authority from '@/common/js/authOptions';

  export default {
    name: "login",
    data() {
      return {
        checked: true,         // 是否记住密码
        account: '',            // 账号
        // accountState: false,    // 账号状态
        password: '',           // 密码
        imgCode: '',            // 验证码
        imgCodeSrc: '',         // 验证码图片
        imgVerifyToken: '',     // 验证码token
        accountOff,             // 账号未输入时图标
        accountOn,              // 账号输入时图标
        lock,                   // 密码未输入时图标
        unlock,                 // 密码输入时图标
        codeOff,                // 验证码未输入时图标
        codeOn,                 // 验证码输入时图标
        errorState: false,
        errorTips: ''
      }
    },
    components: {
      commonInput
    },
    created() {
      let info = JSON.parse(this.$localStore.getItem('accountInfo'));
      let token = this.$localStore.getItem('auth-token');
      // 有token强制跳转至登陆页则强制跳转回首页
      if(token) this.$router.push({path: './'});
      if(info){
        this.account = info.account;
        this.password = info.password;
      }
      this.reGetCodeImg()
    },
    methods: {
      /**
       * 提交数据
       **/
      submitData() {
        if (this.account && this.password && this.imgCode) {
          this.errorState = false;
          const {account, password, imgCode, imgVerifyToken} = this;
          // 请求登陆接口
          this.$post('login/user', {account, password, verifyToken: imgVerifyToken, verifyCode: imgCode}).then(rsp => {
            // 保存本地账号密码/不保存本地账号和密码
            if(this.checked){
              this.$localStore.setItem('accountInfo', JSON.stringify({account, password}));
            }else{
              this.$localStore.removeItem('accountInfo');
            }
            // 用户基本信息
            this.$localStore.setItem('info', JSON.stringify(rsp.data));
            // 角色信息
            this.$localStore.setItem('role', JSON.stringify(rsp.data.role));
            // 保存token
            this.$localStore.setItem('auth-token', rsp.data.token);
            // 路由跳转
            this.$router.push({path: '/'});
            // 角色权限
            let subList = rsp.data.permissionGroups.map(item=>{
              let arr = item.permissions.map(item=>{
                return item.permission;
              });
              return arr
            });
            let authList = [];
            subList.forEach(item=>{
              authList = authList.concat(item);
            });
            for(let key in authority){
              authority[key] = authList.indexOf(key) !== -1;
            }
            this.$localStore.setItem('authority', JSON.stringify(authority));
          }, rej=>{
            if(rej.data.errcode === 460){
              this.$message.error(rej.data.datas[0].message);
            }else{
              this.$message.error(rej.data.errmsg);
            }

            if(rej.data){
              if(rej.data.errcode === 600403 || rej.data.errcode === 600402) this.reGetCodeImg();
            }
          })
        } else {
          this.errorState = true;
          // if (!this.accountState) this.errorTips = '账号各位需为手机号码格式';
         this.errorTips = '输入值不能为空';
        }
      },
      /**
       * 获取输入的账号和是否输入正确的状态
       * @param obj
       */
      changeAcount(obj) {
        this.account = obj.text;
        // this.accountState = obj.flag;
      },
      /**
       * 重新获取验证码
       */
      reGetCodeImg() {
        this.$get('login/getCode').then(rsp => {
          this.imgCodeSrc = rsp.data.verifyImage;
          this.imgVerifyToken = rsp.data.verifyToken;
        });
      }
    }
  }
</script>

<style lang="scss">
  @import '../style/login.scss';
</style>
