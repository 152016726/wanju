<template>
  <!-- 账号管理开始 -->
  <div class="accountManage">
    <div class="flexBox">
      <div>
        <!--<div class="accountSearch">-->
        <!--<commonTextInput :text="'机构名称'" v-model="orgName"></commonTextInput>-->
        <!--<commonTextInput :text="'医生姓名'" v-model="doctorName"></commonTextInput>-->
        <!--<commonTextInput :text="'账号'" v-model="account"></commonTextInput>-->
        <!--<commonSelector :text="'角色'" v-model="roleId" :options="typeList"></commonSelector>-->
        <!--<commonSelector :text="'状态'" v-model="isEnabled" :options="stateList"></commonSelector>-->
        <!--<el-button type="primary" class="major" @click.stop.prevent="initData">查询</el-button>-->
        <!--</div>-->
        <div class="accountManageContent">
          <div class="personTitle">
            <p class="title">账号列表</p>
            <el-button type="primary" v-if="account_add" class="major" @click.prevent.stop="openDialog('')">
              新增账号
            </el-button>
          </div>
          <div class="personContent">
            <div class="personTable">
              <div class="tableHeader">
                <div class="tableCell index">序号</div>
                <div class="tableCell name">姓名</div>
                <div class="tableCell account">账号</div>
                <div class="tableCell nickname">角色别名</div>
                <div class="tableCell range">账号范围</div>
                <div class="tableCell state">状态</div>
                <div class="tableCell handle">操作</div>
              </div>
              <div class="filterDate"></div>
              <div class="tableRow" v-for="(item, index) in dataList" :key="index">
                <div class="tableCell">{{index+1}}</div>
                <div class="tableCell">{{item.userName}}</div>
                <div class="tableCell">{{item.account}}</div>
                <div class="tableCell">{{item.roleName}}</div>
                <div class="tableCell">
                  <span v-if="item.roleId === 6">平台管理员</span>
                  <span v-if="item.roleId !== 6 && item.roleId !== 7">
                {{
                (item.provinceName && item.cityName && item.districtName) ? item.provinceName + item.cityName + item.districtName : (item.provinceName && item.cityName ? item.provinceName + item.cityName : item.provinceName )
                }}
              </span>
                  <span v-if="item.roleId === 7">超级管理员</span>
                </div>
                <div class="tableCell">{{item.isEnable ? '启动' : '禁用'}}</div>
                <div class="tableCell">
                  <el-button type="primary" v-if="account_edit" class="major" @click.prevent.stop="openDialog(item.userId)">
                    编辑
                  </el-button>
                  <el-button type="primary" v-if="account_edit" class="major"
                             @click.prevent.stop="setEnable(!item.isEnable, item.userId)">
                    {{item.isEnable ? '禁用' : '启动'}}
                  </el-button>
                  <el-button type="danger" v-if="account_delete" class="major"
                             @click.prevent.stop="readyToDelete(item.userId)">删除
                  </el-button>
                  <span v-if="!account_edit  && !account_delete">暂无权限编辑</span>
                </div>
              </div>
            </div>
            <div class="noneData" v-if="dataList.length === 0">
              暂无数据
            </div>

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
    <!-- 新建编辑账号开始 -->
    <commonDialog
      :toggleMainContent='toggleMainContent'
      :show='isShowCommonDialog'
      :isShowText='false'
    >
      <addNewAccount
        :userId="userId"
        :toggleContent="toggleMainContent"
      >
      </addNewAccount>
    </commonDialog>
    <!-- 新建编辑账号结束 -->

    <!-- 是否删除账号开始 -->
    <assignAlertDialog
      :title="'删除账号'"
      :isShowDialog="isShowAccount"
      :toggleContent="toggleAccountDialog"
      :confirmDialog="confirmDelete"
    >
      <div class="paddingBox">是否确定删除该账号</div>
    </assignAlertDialog>
    <!-- 是否删除账号结束 -->
  </div>

  <!-- 账号管理结束 -->
</template>

<script>
  import addNewAccount from '@/components/addNewAccount';
  import commonDialog from '@/components/common/commonDialog';
  import assignAlertDialog from '@/components/assignAlertDialog';                  // 通过/拒绝弹窗组件
  import commonTextInput from '@/components/common/commonTextInput';
  import commonSelector from '@/components/common/commonSelector';

  let SEARCH_OBJ = {};                                                   // 搜查对象

  export default {
    name: "accountManage",
    data() {
      return {
        isShowCommonDialog: false,      // 是否展示新增窗口
        isShowAccount: false,
        account_add: false,             // 添加权限
        account_edit: false,            // 编辑权限
        account_delete: false,          // 删除权限
        userId: '',                     // 账户Id
        dataList: [],                   // 数据List
        orgName: '',                    // 机构名称
        doctorName: '',                 // 医生姓名
        account: '',                    // 账号
        roleId: '',                   // 角色类型Id
        typeList: [],                   // 角色List
        isEnabled: '',                  // 是否启用
        stateList: [                    // 状态List
          {label: '全部', value: ''},
          {
            label: '启用',
            value: true
          },
          {
            label: '禁用',
            value: false
          }
        ],
        pageNo: 1,                      // 页码
        pageSize: 10,                   // 页面条数
        totalCount: 0                   // 总条数
      }
    },
    components: {
      addNewAccount,
      commonDialog,
      assignAlertDialog,
      commonTextInput,
      commonSelector
    },
    methods: {
      /**
       * 新建/编辑账号选框的隐藏与显示
       * @param fag
       */
      toggleMainContent(fag) {
        if (fag === -1) {
          this.isShowCommonDialog = false;
        } else {
          this.isShowCommonDialog = !this.isShowCommonDialog;
        }
        if(!this.isShowCommonDialog){
          this.initData()
        }
      },
      /**
       * 删除账号选框的隐藏与显示
       * @param fag
       **/
      toggleAccountDialog(fag) {
        if (fag === -1) {
          this.isShowAccount = false;
        } else {
          this.isShowAccount = !this.isShowAccount;
        }
      },
      /**
       * 准备删除账号
       * @param userId
       */
      readyToDelete(userId) {
        this.userId = userId;
        this.toggleAccountDialog()
      },
      /**
       * 确认删除账号
       */
      confirmDelete() {
        const {userId} =this;
        this.$post('user/delete', {
          userId
        }).then(rsp => {
          this.initData();
          this.toggleAccountDialog(-1)
        }, rej => {
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }})
      },
      /**
       * 禁用/启动
       * @param flag type:boolean true启动/false禁用
       * @param userId type:string
       */
      setEnable(flag, userId) {
        this.$post('user/setEnable', {
          userId,
          isEnabled: flag
        }).then(rsp => {
          this.initData()
        }, rej => {
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }})
      },
      /**
       * 打开账号信息弹窗
       * @param userId
       */
      openDialog(userId) {
        this.userId = userId;
        this.toggleMainContent()
      },
      /**
       * 初始化数据
       */
      initData() {
        const {orgName, doctorName, account, roleId, isEnabled, pageSize} = this;
        Object.assign(SEARCH_OBJ, this);
        // 重置为默认的第一页
        this.pageNo = 1;
        this.$post('user/getPage', {
          orgName, doctorName, account, roleId, isEnabled, pageNo: 1, pageSize
        }).then(rsp => {
          this.totalCount = rsp.total;
          this.dataList = rsp.datas;
        }, rej => {
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }})
      },
      /**
       * 页码变更查询
       * @param val 页码
       */
      pageNoSearch(val){
        const {orgName, doctorName, account, roleId, isEnabled, pageSize} = SEARCH_OBJ;
        this.$post('user/getPage', {
          orgName, doctorName, account, roleId, isEnabled, pageNo: val, pageSize
        }).then(rsp => {
          this.totalCount = rsp.total;
          this.dataList = rsp.datas;
        }, rej => {
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }})
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
        this.pageNoSearch(val);
      }
    },
    created() {
      let authObj = JSON.parse(this.$localStore.getItem('authority'));
      // 初始化权限
      if(authObj){
        this.account_add = authObj['account_add'];
        this.account_edit = authObj['account_edit'];
        this.account_delete = authObj['account_delete'];
      }
      this.initData();
      // 获取角色类型列表
      this.$post('user/role/getPage', {
        pageNo: 1,
        pageSize: 100
      }).then(rsp => {
        this.typeList = rsp.datas.map(item=>{
          return {
            label: item.roleName,
            value: item.roleId
          }
        });
      }, rej => {
        if(rej.data.errcode === 460){
          this.$message.error(rej.data.datas[0].message);
        }else{
          this.$message.error(rej.data.errmsg);
        }})
    }
  }
</script>

<style lang="scss">
  @import '../style/accountManage.scss';
</style>
