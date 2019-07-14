<template>
  <div class="versionList">
    <div class="flexBox">
      <div>
        <div class="versionContent">
          <div class="versionTitle">
            <p class="title">版本管理</p>
            <div class="functionBtns">
              <el-button type="primary" class="major" v-if="version_add" @click.stop.prevent="openVersionInfo('')">更新
              </el-button>
            </div>
          </div>
          <div class="versionTable">
            <div class="tableHeader">
              <div class="tableCell index">序号</div>
              <div class="tableCell appName">应用名称</div>
              <div class="tableCell updateInfo">更新内容</div>
              <div class="tableCell curVersion">版本号</div>
              <div class="tableCell publishTime">发布时间</div>
              <div class="tableCell handle">操作</div>
            </div>
            <div class="tableRow" v-for="(item, index) in dataList" :key="index">
              <div class="tableCell index">
                <div>{{index+1}}</div>
              </div>
              <div class="tableCell appName">
                <div>{{item.appName }}</div>
              </div>
              <div class="tableCell updateInfo">
                <div>{{item.content}}</div>
              </div>
              <div class="tableCell curVersion">
                <div>{{item.versionCode}}</div>
              </div>
              <div class="tableCell publishTime">
                <div>{{item.createTime}}</div>
              </div>
              <div class="tableCell handle">
                <el-button type="primary" class="major" v-if="version_edit"
                           @click.prevent.stop="openVersionInfo(item.appId, item)">编辑
                </el-button>
                <el-button type="primary" class="major" v-if="version_delete" @click.prevent.stop="deleteVersion(item.appId)">
                  删除
                </el-button>
                <span v-if="!version_edit && !version_delete">暂无权限编辑</span>
              </div>
            </div>
          </div>
          <div class="noneData" v-if="dataList.length === 0">
            暂无数据
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout=" prev, pager, next,total, sizes, jumper"
          background
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!-- 编辑/更新版本开始 -->
    <assignAlertDialog
      :title="appId ? '编辑版本': '更新版本'"
      :isShowDialog="isVersionInfo"
      :toggleContent="toggleMainContent"
      :confirmDialog="confirmSetVersion"
    >
      <editVersion ref="version" :appId="appId" :versionData="versionData">
      </editVersion>
    </assignAlertDialog>
    <!-- 编辑/更新版本结束 -->
    <!-- 是否删除文章开始 -->
    <assignAlertDialog
      :title="'删除版本'"
      :isShowDialog="isShowDelete"
      :toggleContent="toggleDeleteDialog"
      :confirmDialog="confirmDelete"
    >
      <div class="paddingBox">是否确定删除该版本</div>
    </assignAlertDialog>
    <!-- 是否删除文章结束 -->
  </div>
</template>

<script>
  import assignAlertDialog from '@/components/assignAlertDialog';                  // 通过/拒绝弹窗组件
  import editVersion from '@/components/editVersion';                              // 编辑版本组件
  export default {
    name: "version",
    data() {
      return {
        dataList: [],                     // 版本List
        appId: '',                        // appId
        isVersionInfo: false,             // 是否展示编辑窗口
        version_edit: false,              // 编辑权限
        version_add: false,               // 添加权限
        version_delete: false,            // 删除权限
        pageNo: 1,                        // 当前页码
        pageSize: 10,                     // 当前条数
        totalCount: 0,                    // 页面信息数量（留待后面分页器用）
        deleteId: '',                     // 删除的版本Id
        versionData: {},                  // 版本具体信息
        isShowDelete: false
      }
    },
    components: {
      assignAlertDialog,
      editVersion
    },
    methods: {
      /**
       * 初始化数据
       */
      initData() {
        const {pageNo, pageSize} = this;
        this.$post('app/getPage', {pageNo, pageSize}).then(rsp => {
          this.dataList = rsp.datas;
        }, rej => {
          if (rej.data.errcode === 460) {
            this.$message.error(rej.data.datas[0].message);
          } else {
            this.$message.error(rej.data.errmsg);
          }
        })

      },
      /**
       * 添加/编辑微信公众号
       * @param appId type: string
       * @param item type: Obj
       */
      openVersionInfo(appId, item) {
        this.appId = appId;
        if (item) {
          this.versionData = item;
        }
        this.toggleMainContent();
      },
      /**
       * 删除版本List中的某一项
       * @param appId    type:string
       */
      deleteVersion(appId) {
        this.deleteId = appId;
        this.toggleDeleteDialog()
      },
      /**
       * 开关查看弹窗
       * @param fag
       */
      toggleMainContent(fag) {
        if (fag === -1) {
          this.isVersionInfo = false;
        } else {
          this.isVersionInfo = !this.isVersionInfo;
        }
        if (!this.isVersionInfo) {
          this.initData()
        }
      },
      /**
       * 改变pageSize
       * @param val
       */
      handleSizeChange(val) {
        this.pageSize = val;
        this.initData();
      },
      /**
       * 改变当前展示页
       */
      handleCurrentChange(val) {
        this.pageNo = val;
        this.initData();
      },
      /**
       * 确定更新或者编辑版本号
       */
      confirmSetVersion() {
        const {appName, versionName, content, forceUpdate, appId, appFile, appType} = this.$refs.version;
        // 编辑版本号
        const formData = new FormData();
        if(appFile) formData.append('appFile', appFile);
        formData.append('appName', appName);
        formData.append('versionName', versionName);
        formData.append('content', content);
        formData.append('forceUpdate', forceUpdate);
        formData.append('appId', appId);
        formData.append('appType', appType);
        if (this.appId) {
          this.$post('app/update',formData).then(rsp=>{
            this.toggleMainContent(-1)
          }, rej=>{
            if (rej.data.errcode === 460) {
              this.$message.error(rej.data.datas[0].message);
            } else {
              this.$message.error(rej.data.errmsg);
            }
          });

        } else {
          // 更新版本号
          this.$post('app/add', formData).then(rsp => {
            this.toggleMainContent(-1);
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
       * 删除版本选框的隐藏与显示
       * @param fag
       **/
      toggleDeleteDialog(fag) {
        if (fag === -1) {
          this.isShowDelete = false;
        } else {
          this.isShowDelete = !this.isShowDelete;
        }
        if (!this.isShowDelete) {
          this.initData()
        }
      },
      /**
       * 确认删除资讯
       */
      confirmDelete() {
        this.$post('app/delete', {
          appId: this.deleteId
        }).then(rsp => {
          this.toggleDeleteDialog(-1);
          this.initData()
        }, rej => {
          if (rej.data.errcode === 460) {
            this.$message.error(rej.data.datas[0].message);
          } else {
            this.$message.error(rej.data.errmsg);
          }
        })
      }
    },
    created() {
      this.initData();
      let authObj = JSON.parse(this.$localStore.getItem('authority'));
      // 初始化权限
      if (!!authObj) {
        // 版本编辑权限
        this.version_edit = authObj['version_edit'];
        this.version_delete = authObj['version_delete'];
        this.version_add = authObj['version_add'];
        // this.version_edit = true;
      }
    }
  }
</script>

<style lang="scss">
  @import "../style/version.scss";
</style>
