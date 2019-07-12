<template>
  <div class="editVersion">
    <commonTextInput :text="'应用名称'" :placeholder="'请输入应用名称'" v-model="appName"></commonTextInput>
    <commonTextInput :text="'升级版本号'" :placeholder="'请输入升级版本号'" v-model="versionName"></commonTextInput>
    <commonSelector :text="'类型'" :placeholderText="'请输入'" v-model="appType" :options="appTypeList" :isDisabled="isDisabledAppType"></commonSelector>
    <div class="fileUploader">
      <i class="iconText">安装包</i>
      <el-upload
        class="avatar-uploader"
        action="string"
        :headers="headers"
        :with-credentials="true"
        :show-file-list="false"
        :http-request="uploadFile"
        :before-upload="beforeFileUpload"
      >
        <span class="uploadBtn">{{fileName ? fileName : '选择文件'}}</span>
      </el-upload>
      <el-progress class="lineProgress" :percentage="percentage" :color="'#4486FF'"></el-progress>
    </div>
    <div class="updateIntro clearfix">
      <div class="intro fl">更新内容</div>
      <el-input
        class="textArea fl"
        type="textarea"
        placeholder="请输入更新内容"
        resize="none"
        v-model="content"
        maxlength="300"
        show-word-limit
      >
      </el-input>
    </div>
    <div class="updateIntro clearfix">
      <div class="intro fl">是否强制更新</div>
      <el-switch
        v-model="forceUpdate"
        active-color="#4486FF"
        inactive-color="#DDDDDD">
      </el-switch>
    </div>
  </div>
</template>

<script>
  import commonTextInput from './commonTextInput';
  import commonSelector from './commonSelector';
  import timer from '@/common/js/timer';

  const timerOps = {          // 计时器参数
    key: 'notFound',
    duration: 9
  };

  export default {
    name: "editVersion",
    components: {
      commonTextInput,
      commonSelector
    },
    data() {
      return {
        appName: '',            // 应用名称
        versionName: '',        // 版本名称
        appType: '',            // APP类型
        appTypeList: [          // APP类型List
          {label: '安卓', value: 1},
          {label: 'IOS', value: 2}
        ],
        isDisabledAppType: false, // 是否禁用APP类型
        fileName: '',           // 文件名称
        appFile: '',            // 上传文件
        content: '',            // 更新内容
        appFileId: '',          // 文件Id
        forceUpdate: false,     // 是否强制更新
        headers: {                                       // 请求头
          "Content-Type": 'multipart/form-data'
        },
        percentage: 0
      }
    },
    props:{
      appId: {default: ''},                              // appId
      versionData: {default: () =>{}}                    // 版本信息
    },
    methods:{
      /**
       * 设定计时器
       * @param duration
       */
      setDuration(duration) {
        if (duration > 0) {
          this.percentage = (10-duration)*10;
        } else {
          // 销毁计时器
          timer.clearTimer(timerOps.key);
        }
      },
      /**
       * 开始计时器
       */
      setUpdateTimer(){
        // 销毁计时器
        timer.clearTimer(timerOps.key);
        // 创建计时器
        timer.setTimer(Object.assign(
          {},
          timerOps,
          {
            callback: (duration) => {
              this.setDuration(duration)
            }
          }
        ))
      },
      /**
       * 版本更新
       */
      versionUpdate(){
        timer.clearTimer(timerOps.key);
        this.percentage = 100;
        this.fileName = '上传成功';
      },
      /**
       * 版本更新失败
       */
      defeatUpdate(){
        timer.clearTimer(timerOps.key);
        this.percentage = 0;
        this.fileName='上传失败';
      },
      /**
       * 上传文件
       * @param param
       */
      uploadFile(param) {
        this.appFile = param.file;
        this.versionUpdate();
      },
      /**
       * 文件上传成功
       * @param file
       */
      beforeFileUpload(file) {
        this.setUpdateTimer();
        return true;
      },
    },
    created(){
      // 数据回显
      if(this.appId){
        Object.assign(this, this.versionData);
        this.isDisabledAppType = true;
      }
    },
    destroyed() {
      // 销毁计时器
      timer.clearTimer(timerOps.key);
    }
  }
</script>

<style lang="scss">
  .editVersion{
    padding: 20px 83px;
    .iconText{
      width: 135px;
      text-align: right;
    }
    .updateIntro {
      margin-bottom: 30px;
      width: 840px;

      .intro {
        width: 135px;
        margin-right: 10px;
        text-align: right;
        vertical-align: middle;

        &.center {
          margin-top: 72px;
        }
      }

      .el-textarea__inner, .textArea {
        width: 695px;
        height: 160px;

        .el-input__count {
          color: #F65860;
        }
      }

      .teamMember {
        display: flex;
        flex-wrap: wrap;

        > div {
          margin-right: 42px;

          &:nth-child(4n) {
            margin-right: 0;
          }
        }

        .member {
          width: 160px;
          height: 160px;
          border: 1px solid #DDDDDD;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 23px;
          font-size: 16px;
          position: relative;

          .icon {
            cursor: pointer;
            position: absolute;
            top: -14px;
            right: -14px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: url("../assets/btn_delete.png") no-repeat center center;
            background-size: cover;
            vertical-align: middle;
            text-align: center;
            color: #ffffff;
            font-size: 28px;
          }

          .avatar {
            width: 60px;
            height: 60px;
            margin-bottom: 6px;
          }
        }

        .addTeamMember {
          cursor: pointer;
          width: 160px;
          height: 160px;
          background: url("../assets/btn_add_big.png") no-repeat center center;
          background-size: cover;
        }
      }
    }
    .fileUploader {
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      .iconText {
        margin-right: 10px;
      }
      .lineProgress{
        display: flex;
        align-items: center;
        width: 300px;
        /*height: 20px;*/
        margin-left: 20px;
      }
    }
    .uploadBtn {
      cursor: pointer;
      border-radius: 6px;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #BABABA;
      border: 1px solid #DDDDDD;
      box-sizing: border-box;
      display: block;
    }
    .txtLoad {
      margin: 0 0 20px 130px;
      padding: 0 0;
      border: none;
      height: 20px;
      line-height: 20px;
      text-indent: 20px;
      text-align: left;
      background: url("../assets/ic_txt.png") no-repeat center left;
      background-size: contain;
    }
  }


</style>
