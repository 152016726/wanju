<template>
  <assignAlertDialog
    :title="newsId ? '编辑资讯' : '发布资讯'"
    :isShowDialog="isShow"
    :toggleContent="toggleRoleMemberDialog"
    :confirmDialog="confirmRoleMemberDialog"
    :isCenter="false"
    :textIndent="'60px'"
  >
    <div class="editWeixinDiggInfo" :class="{toggle: !isShowOrg}">
      <commonSelector
        :text="'板块'"
        v-model="category"
        :options="categoryList"
        :isDisabled="isDisabledCategory"
      >
      </commonSelector>

      <commonAutocomplete
        :text="'医疗机构'"
        v-model="newsId || isDisabledOrg ? orgName : orgId"
        :isDisabled="!!newsId || isDisabledOrg"
        v-if="isShowOrg"
        :filterState="filterOrgs"
      >
      </commonAutocomplete>

      <!-- 输入主题开始 -->
      <div class="plateContent" :class="{active: isFocus}">
        板块：<input type="text" class="plateTitle" placeholder="请输入主题" v-model="title" v-on:focus="textOnFocus"
                  v-on:blur="textOnblur">
      </div>
      <!-- 输入主题结束 -->

      <!-- 添加封面开始 -->
      <div class="addSurface">
        <p class="surfaceText">添加封面图 <i>(只能选一张)</i></p>
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
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <!-- 添加封面结束 -->

      <!-- 富文本编辑器开始 -->
      <div class="editor">
        <editor id="tinymce" v-model="content" :init="editorInit"></editor>
      </div>
      <!-- 富文本编辑器结束 -->
    </div>
  </assignAlertDialog>
</template>

<script>
  import assignAlertDialog from '@/components/assignAlertDialog';
  import commonSelector from '@/components/commonSelector';
  import commonTextInput from '@/components/commonTextInput';
  import commonAutocomplete from '@/components/commonAutocomplete';
  import tinymce from 'tinymce/tinymce';
  import 'tinymce/themes/silver/theme';
  import Editor from '@tinymce/tinymce-vue';
  import 'tinymce/plugins/image';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/table';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/contextmenu';
  import 'tinymce/plugins/wordcount';
  import 'tinymce/plugins/colorpicker';
  import 'tinymce/plugins/textcolor';


  const SUPERPOWER = [6, 7];       // 平台管理员和超级管理员的roleType

  export default {
    name: "editWeixinDiggInfo",
    components: {
      assignAlertDialog,
      commonSelector,
      commonTextInput,
      commonAutocomplete,
      Editor
    },
    props: {
      newsId: {default: ''},           // 资讯id
      toggleMainContent: {},
      isShow: {default: false}        // 是否展示窗口
    },
    data() {
      return {
        coverPicFileId: '',                         // 封面图片文件ID
        imageUrl: '',                               // 上传的封面url
        orgId: '',                                  // 机构Id
        orgName: '',                                // 机构Name
        isDisabledOrg: false,                       // 是否禁用机构
        isShowOrg: true,                            // 是否展示机构名称
        organizationList: [],                       // 机构列表
        category: '',                               // 板块
        isDisabledCategory: false,                  // 是否可编辑板块类型
        categoryList: [                             // 板块List
          {
            label: '机构资讯',
            value: 1
          },
        ],
        isFocus: false,                               // 是否聚焦
        title: '',                                    // 标题
        content: '',                                  //  编辑内容
        editorInit: {
          height: 300,
          language_url: '/static/tinymce/zh_CN.js',
          language: 'zh_CN',
          skin_url: '/static/tinymce/skins/ui/oxide',
          plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
          toolbar:
            'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
          branding: false,
          resize: false,
          image_title: true,
          automatic_uploads: true,
          images_upload_handler: this.handleImgUpload,
          file_picker_types: 'image',
          file_picker_callback: this.pointImgUpload
        },
        isSticky: false,                                // 是否被置顶
        requestUrl: this.$uploadUrl,    // 请求路径
        headers: {                                              // 请求头
          "Content-Type": 'multipart/form-data'
        }
      }
    },
    watch: {
      /**
       *  监测newsId
       */
      newsId(newsId) {
        // 公众号咨询回显
        if (newsId) {
          this.isDisabledCategory = true;
          this.$post('news/getById', {
            newsId
          }).then(rsp => {
            Object.assign(this, rsp.data);
            this.imageUrl = this.$downloadUrl + rsp.data.coverPicFileId;

          }, rej => {
            if (rej.data.errcode === 460) {
              this.$message.error(rej.data.datas[0].message);
            } else {
              this.$message.error(rej.data.errmsg);
            }
          })
        } else {
          this.category = '';
          this.orgId = '';
          this.title = '';
          this.coverPicFileId = '';
          this.content = '';
          this.isSticky = false;
          this.isDisabledCategory = false;
          this.imageUrl = '';
        }
      },
      isShow(val) {
        if (!val && !this.newsId) {
          this.category = '';
          this.orgId = '';
          this.title = '';
          this.coverPicFileId = '';
          this.content = '';
          this.isSticky = false;
          this.isDisabledCategory = false;
          this.imageUrl = '';
        }
        if (val) {
          tinymce.init({})
        }
      },
      /**
       * 监测资讯类型
       */
      category(val) {
        if (val === '') {
          this.isShowOrg = true;
        } else {
          this.isShowOrg = !!val;
        }
      }
    },
    methods: {
      /**
       * 开关角色编辑窗口
       */
      toggleRoleMemberDialog() {
        this.toggleMainContent()
      },
      /**
       * 确认关闭窗口
       */
      confirmRoleMemberDialog() {
        const {category, orgId, title, coverPicFileId, content, isSticky, newsId} = this;
        if (!newsId) {
          // 添加公众号资讯
          this.$post('news/add', {
            category, orgId, title, coverPicFileId, content, isSticky
          }).then(rsp => {
            this.$message.success(rsp.errmsg);
            this.toggleMainContent(-1)
          }, rej => {
            if (rej.data.errcode === 460) {
              this.$message.error(rej.data.datas[0].message);
            } else {
              this.$message.error(rej.data.errmsg);
            }
          })
        } else {
          // 更新公众号资讯
          this.$post('news/update', {
            title, newsId, coverPicFileId, content, isSticky
          }).then(rsp => {
            this.$message.success(rsp.errmsg);
            this.toggleMainContent(-1)
          }, rej => {
            if (rej.data.errcode === 460) {
              this.$message.error(rej.data.datas[0].message);
            } else {
              this.$message.error(rej.data.errmsg);
            }
          })
        }
      },
      /**
       * 主题聚焦时间
       */
      textOnFocus() {
        this.isFocus = true;
      },
      /**
       * 主题失焦事件
       */
      textOnblur() {
        this.isFocus = false;
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
            this.coverPicFileId = rsp.data.id;
            this.imageUrl = this.$downloadUrl + rsp.data.id;
          }
        }, rej => {
          if (rej.data.errcode === 460) {
            this.$message.error(rej.data.datas[0].message);
          } else {
            this.$message.error(rej.data.errmsg);
          }
        })
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
      /**
       * 远程搜索筛选数组
       * @param str type:string 待筛选字段
       * @param res type:Function promise的成功回调
       * @param rej type:Function promise的失败回调
       */
      filterOrgs(str, res, rej) {
        // 接口调用最后返回一个数组
        this.$post('organ/getPage', {
          orgName: str,
          pageNo: 1,
          pageSize: 10
        }).then(rsp => {
          let result = rsp.datas.map(item => {
            item.id = item.orgId;
            item.value = item.orgName;
            return item
          });
          res(result)
        }, reject => {
          this.$message.error(reject.data.errmsg);
          rej([])
        });
      },
      /**
       * 富文本拖拽图片上传
       * @param blobInfo  文件信息
       * @param success   成功回调
       * @param failure   失败回调
       */
      handleImgUpload(blobInfo, success, failure) {
        const formData = new FormData();
        formData.append('content', blobInfo.blob());
        this.$post(this.requestUrl, formData).then(rsp => {
          if (rsp.errcode !== 0) {
            this.$message.error(rsp.errmsg);
            failure('error')
          } else {
            this.$message.success(rsp.errmsg);
            success(this.$downloadUrl + rsp.data.id)
          }
        }, rej => {
          if (rej.data.errcode === 460) {
            this.$message.error(rej.data.datas[0].message);
          } else {
            this.$message.error(rej.data.errmsg);
          }
          failure('error')
        });
      },
      /**
       * 点击图片上传
       * @param callback 回调函数
       * @param value
       * @param meta
       */
      pointImgUpload(callback, value, meta) {
        let that = this;
        let input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = function () {
          const formData = new FormData();
          formData.append('content', this.files[0]);
          const isLt5M = this.files[0].size / 1024 / 1024 < 5;

          if (!isLt5M) {
            this.$message.error('上传头像图片大小不能超过 5MB!');
          }
          that.$post(that.requestUrl, formData).then(rsp => {
            if (rsp.errcode !== 0) {
              that.$message.error(rsp.errmsg);
            } else {
              that.$message.success(rsp.errmsg);
              callback(that.$downloadUrl + rsp.data.id, {title: rsp.data.originalName})
            }
          }, rej => {
            if (rej.data.errcode === 460) {
              that.$message.error(rej.data.datas[0].message);
            } else {
              that.$message.error(rej.data.errmsg);
            }
          });
        };

        input.click();

      }
    },
    created() {
      let roleType = JSON.parse(this.$localStore.getItem('role')).roleType;
      let orgName = JSON.parse(this.$localStore.getItem('info')).orgName;
      // 平台管理员和超级管理员特殊处理
      if (SUPERPOWER.indexOf(roleType) !== -1) {
        this.categoryList = [{
          label: '公共资讯',
          value: 0
        },
          {
            label: '机构资讯',
            value: 1
          }]
      }
      // 机构管理员特殊处理
      if (roleType === 2) {
        this.orgName = orgName;
        this.category = 1;
        this.isDisabledOrg = true;
      }
      // 阻止浏览器返回键
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      });
    }
  }
</script>

<style lang="scss">
  @media screen and (max-width: 1300px) {
    .editWeixinDiggInfo {
      .commonSelector, .commonAutocomplete {
        .iconText {
          width: 90px;
        }
      }
    }
    .editWeixinDiggInfo .editor .ck-reset_all {
      > div:nth-child(1) {
        width: 120px;

        .ck-button__label {
          width: 80px;
        }
      }
    }
  }

  .editWeixinDiggInfo {
    padding: 25px 60px;

    .iconText {
      width: 75px;
      text-align: right;
    }

    &.toggle {
      .iconText {
        /*width: px;*/
        width: auto;
        text-align: right;
      }
    }

    .plateContent {
      width: 1234px;
      font-size: 16px;
      line-height: 38px;
      border-bottom: 1px solid #DDDDDD;

      &.active {
        border-bottom: 1px solid #4486FF;
      }

      .plateTitle {
        input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
          /* WebKit browsers */
          color: #BABABA;
        }

        input:-moz-placeholder, textarea:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #BABABA;
        }

        input::-moz-placeholder, textarea::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #BABABA;
        }

        input:-ms-input-placeholder, textarea:-ms-input-placeholder {
          /* Internet Explorer 10+ */
          color: #BABABA;
        }
      }
    }

    .addSurface {
      padding-top: 20px;
      margin-bottom: 30px;

      .surfaceText {
        font-size: 16px;
        padding: 9px 0;

        i {
          color: #F65860;
          font-size: 12px;
        }
      }

      .avatar-uploader .el-upload {
        border: 1px solid #DDDDDD;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 160px;
        height: 160px;
        line-height: 160px;
        text-align: center;
      }

      .avatar {
        width: 160px;
        height: 160px;
        display: block;
      }
    }

    .editor {
      border: 1px solid #DDDDDD;
    }

    .ck-editor__editable {
      min-height: 446px;
      border: 1px solid #DDDDDD;
    }


  }
</style>
