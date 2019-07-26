<template>
  <assignAlertDialog
    :title="'医生详情'"
    :isShowDialog="show"
    :toggleContent="toggleRoleMemberDialog"
    :confirmDialog="confirmRoleMemberDialog"
  >
    <div class="editRoleMember">
      <div class="baseInfo">
        <div class="editRoleLeft">
          <commonTextInput :text="'姓名'" v-model="doctorName" :isDisabled="true"></commonTextInput>
          <commonTextInput :text="'编码'" v-model="doctorCode" :isDisabled="true"></commonTextInput>
          <commonTextInput :text="'职称'" v-model="posTitleName" :isDisabled="true" :placeholderText="''"></commonTextInput>
          <commonTextInput :text="'性别'" v-model="sexName" :isDisabled="true"></commonTextInput>
          <commonTextInput :text="'机构'" v-model="orgName" :isDisabled="true"></commonTextInput>
        </div>
        <div class="editRoleRight">
          <el-upload
            class="avatar-uploader"
            action="string"
            :headers="headers"
            :with-credentials="true"
            :accept="'image/*'"
            :show-file-list="false"
            :http-request="uploadImage"
            :before-upload="beforeAvatarUpload"
          >
            <img :src="imageUrl" v-if="headImgFileId" class="avatar" alt="个人头像">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

        </div>
      </div>
      <div class="description">
        <div class="teamIntro clearfix">
          <div class="intro fl">个人简介</div>
          <el-input
            class="textArea fl"
            type="textarea"
            placeholder="请输入内容"
            resize="none"
            v-model="description"
            maxlength="300"
            show-word-limit
          >
          </el-input>
        </div>
        <div class="teamIntro clearfix">
          <div class="intro fl">个人擅长</div>
          <el-input
            class="textArea fl"
            type="textarea"
            placeholder="请输入内容"
            resize="none"
            v-model="goodAt"
            maxlength="300"
            show-word-limit
          >
          </el-input>
        </div>
      </div>
    </div>
  </assignAlertDialog>
</template>

<script>
  import assignAlertDialog from './assignAlertDialog';
  import commonTextInput from './common/commonTextInput';

  export default {
    name: "editRoleMember",
    components: {
      assignAlertDialog,
      commonTextInput
    },
    data() {
      return {
        doctorName: '',                       // 姓名
        doctorCode: '',                       // 编码
        jobName: '',                          // 职称
        sexName: '',                           // 性别
        orgName: '',                          // 组织名称
        orgId: '',                            // 组织id
        description: '',                      // 团队简介
        goodAt: '',                           // 团队擅长
        posTitleName: '',                    // 医生职称
        headImgFileId: '',                    // 头像图片文件ID
        imageUrl: '',                          // 头像路径
        requestUrl: this.$uploadUrl,
        headers: {                            // 请求头
          "Content-Type": 'multipart/form-data'
        }
      }
    },
    props: {
      id: {default: ''},             // 成员id
      toggleMainContent: {},
      show: {default: false}        // 是否展示医生详情
    },
    watch: {
      id(val) {
        this.$post('doctor/getById', {
          doctorId: val
        }).then(rsp => {
          Object.assign(this, rsp.data);
          const {goodAt, description, posTitleName, headImgFileId} = rsp.data;
          this.goodAt = goodAt;
          this.description = description;
          this.posTitleName = posTitleName;
          this.headImgFileId = headImgFileId;
          this.imageUrl = this.$downloadUrl + headImgFileId;
        })
      }
    },
    methods: {
      /**
       * 开关角色编辑窗口
       */
      toggleRoleMemberDialog(flag) {
        this.toggleMainContent(flag)
      },
      /**
       * 确认关闭窗口
       */
      confirmRoleMemberDialog() {
        const {doctorId, goodAt, description, headImgFileId} = this;
        this.$post('doctor/update', {
          doctorId, goodAt, description, headImgFileId
        }).then(rsp => {
          this.toggleRoleMemberDialog(-1)
        }, rej => {
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }});
      },
      /**
       * 图像上传
       */
      uploadImage(param) {
        const formData = new FormData();
        formData.append('content', param.file);
        this.$post(this.requestUrl, formData).then(rsp => {
          if (rsp.errcode !== 0) {
            this.$message.error(rsp.errmsg);
          } else {
            this.$message.success(rsp.errmsg);
            this.headImgFileId = rsp.data.id;
            this.imageUrl = this.$downloadUrl + rsp.data.id;
          }
        }, rej => {
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }})
      },
      /**
       * 头像上传限制
       * @param file
       * @returns {boolean}
       */
      beforeAvatarUpload(file) {
        const isTp = file.type.indexOf('image') !== -1;

        if (!isTp) {
          this.$message.error('只能上传图片格式文件!');
        }

        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isLt5M && isTp
      },
    }
  }
</script>

<style lang="scss">
@import '../style/editRoleMember.scss';
</style>
