<template>
  <div class="addNewRole">
    <!-- 弹窗头部开始 -->
    <div class="addNewRoleTitle">
      <span>{{roleId ? '编辑角色' : '新建角色'}}</span>
      <div class="closeIcon" @click.stop.prevent="closeContent">&times;</div>
    </div>
    <!-- 弹窗头部结束 -->

    <!-- 弹窗内容开始 -->
    <div class="addNewRoleContent">
      <div class="inputContent">
        <commonTextInput :text="'角色名称'" v-model="roleName"></commonTextInput>
        <commonTextInput :text="'角色别名'" v-model="aliasName"></commonTextInput>
        <commonSelector :text="'角色类型'" v-model="roleType" :options="typeList"></commonSelector>
      </div>
      <p class="contentTitle">
        <span class="title">权限管理</span>
      </p>
      <div class="authorityHead">
        <div class="authorityCell showAuthority">列表显示权限</div>
        <div class="authorityCell selectAll">全选</div>
        <div class="authorityCell handleAuthority">操作权限</div>
      </div>
      <div class="authorityTable">
        <!-- 权限栏开始 -->
        <roleCheckBox
          v-for="(item, index) in authList"
          :key="index"
          :authObj="item"
          v-model="permissionIds"
        >
        </roleCheckBox>
        <!-- 权限栏结束 -->

      </div>
      <!-- 弹窗底部开始 -->
      <div class="assignDialogFooter">
        <el-button type="primary" class="major" @click.stop.prevent="checkDialog">通过</el-button>
        <el-button type="info" class="info" @click.stop.prevent="cutOffDialog">取消</el-button>
      </div>
      <!-- 弹窗底部结束 -->
    </div>
    <!-- 弹窗内容结束 -->
  </div>
</template>

<script>
  import commonTextInput from './common/commonTextInput';
  import commonSelector from './common/commonSelector';
  import roleCheckBox from './roleCheckBox';

  export default {
    name: "addNewRole",
    data() {
      return {
        roleType: '',           // 角色类型
        typeList: [],           // 角色List
        roleName: '',           // 角色名称
        aliasName: '',           // 角色别名
        authList: [],           // 权限List
        permissionIds: []          // 选中的权限List
      }
    },
    components: {
      commonTextInput,
      commonSelector,
      roleCheckBox
    },
    props: {
      roleId: {default: ''},             // 角色Id
      toggleContent: {},                // 开关弹窗
    },
    methods: {
      /**
       * 关闭弹窗
       **/
      closeContent() {
        this.toggleContent(-1);
      },
      /**
       * 确定按钮
       */
      checkDialog() {
        const {roleName, aliasName, roleType, permissionIds} = this;
        if (this.roleId) {
          // 更新团队成员
          this.$post('user/role/update', {
            id: this.roleId,
            roleName,
            aliasName,
            roleType,
            permissionIds
          }).then(rsp => {
            this.toggleContent(-1);
          }, rej => {
            if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }})
        } else {
          // 添加团队成员
          this.$post('user/role/add', {
            roleName, aliasName, roleType, permissionIds
          }).then(rsp => {
            this.toggleContent(-1);
          }, rej => {
            if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }})
        }
      },
      /**
       * 取消按钮
       */
      cutOffDialog() {
        this.toggleContent(-1);
        // 取消之后要进行的操作      ----  为后续迭代开发用
        this.$emit('cancelDialog')
      }
    },
    created() {
      const {roleId} = this;
      // 获取当前页面详情
      this.$post('user/role/detail', {roleId}).then(rsp => {
        this.authList = rsp.data.permissionGroupDatas;
        this.roleName = rsp.data.roleName;
        this.aliasName = rsp.data.aliasName;
        this.roleType = rsp.data.roleType;
        let opt = [];
        rsp.data.permissionGroupDatas.forEach(item => {
          item.permissionDatas.forEach(val => {
            if (val.isEnabled) {
              opt.push(val.permissionId)
            }
          })
        });
        // 初始化已选中的valueList
        this.permissionIds = opt;
      }, rej => {
        if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }});
      // 获取角色类型列表
      this.$post('dict/get', {catalogKey: 'ROLE_TYPE'}).then(rsp => {
        this.typeList = rsp.datas.map(item => {
          return {
            label: item.dicName,
            value: item.dicCode
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

<style lang="scss" scoped>
@import '../style/addNewRole.scss';
</style>
