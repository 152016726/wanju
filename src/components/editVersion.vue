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
  import commonTextInput from './common/commonTextInput';
  import commonSelector from './common/commonSelector';
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
@import "../style/editVersion.scss";
</style>
