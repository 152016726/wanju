<template>
  <div class="addNewTeamMember">
    <!-- 弹窗头部开始 -->
    <div class="addNewTeamTitle">
      <span>{{memberList.length === 0 ? '新建成员' : '编辑成员'}}</span>
      <div class="closeIcon" @click.stop.prevent="closeContent">&times;</div>
    </div>
    <!-- 弹窗头部结束 -->
    <div class="addNewTeamMemberContent">
      <div class="teamIntro clearfix">
        <div class="intro fl center">团队队长</div>
        <div class="newMember fl">
          <div class="teamMember">
            <div class="member" v-if="!!leader">
              <img :src="leader.headImgFileId ? downloadUrl + leader.headImgFileId : (leader.XB === '男性' ? man : women)" :alt="leader.YSXM" class="avatar">
              <span class="doctorName">{{leader.YSXM}}</span>
              <span class="gender">{{leader.XB}}</span>
              <span class="doctorType">{{leader.posTitleName}}</span>
              <i class="icon" @click.prevent.stop="deleteClick(leader.YSTDCYID)"></i>
            </div>
            <div class="addTeamMember" v-if="!leader" @click.stop.prevent="addTeamLeader"></div>
          </div>
        </div>
      </div>
      <div class="teamIntro clearfix">
        <div class="intro fl center">团队成员</div>
        <div class="newMember fl">
          <div class="teamMember">
            <div class="member" v-for="(item, index) in memberList" :key="index">
              <img :src="item.headImgFileId ? downloadUrl + item.headImgFileId : (item.XB === '男性' ? man : women)" :alt="item.YSXM" class="avatar">
              <span class="doctorName">{{item.YSXM}}</span>
              <span class="gender">{{item.XB}}</span>
              <span class="doctorType">{{item.posTitleName}}</span>
              <i class="icon" @click.prevent.stop="deleteClick(item.YSTDCYID)"></i>
            </div>
            <div class="addTeamMember" @click.stop.prevent="addTeamMember"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择成员结束 -->
    <assignAlertDialog
      :title="'选择团队成员/队长'"
      :isShowDialog="isShowTeamMember"
      :toggleContent="toggleTeamMemberDialog"
      :confirmDialog="confirmTeamMemberDialog"
    >
      <div class="chooseMemberContent">
        <teamMember
          v-for="(item, index) in doctorList"
          :key="index"
          :dataObj="item"
          :type="type"
          :teamId="teamId"
          @clickItem="changeAddIdList"
        >
        </teamMember>
        <div class="noneMember" v-if="doctorList.length === 0">
           暂无成员可添加
        </div>
      </div>
    </assignAlertDialog>
    <!-- 选择成员结束 -->

    <!-- 是否删除成员开始 -->
    <assignAlertDialog
      :title="'删除成员'"
      :isShowDialog="isShowDelete"
      :toggleContent="toggleDeleteDialog"
      :confirmDialog="deleteTeamMember"
    >
      <div class="paddingBox">
        <commonTextArea v-model="ZXYY" :text="'删除原因'"></commonTextArea>
      </div>
    </assignAlertDialog>
    <!-- 是否删除成员结束 -->

  </div>
</template>

<script>
  import teamMember from './teamMember';
  import assignAlertDialog from './assignAlertDialog';
  import commonSelector from '@/components/common/commonSelector';
  import commonTextArea from './common/commonTextArea';

  export default {
    name: "addNewTeamMember",
    data() {
      return {
        leader: '',                         // 团队队长
        memberList: [],                     // 团队成员
        doctorList: [],                     // 可选择的医生列表
        isShowTeamMember: false,            // 是否展示选择队员弹窗
        ORGID: '',                          // 机构Id
        type: '',                           // 类型：'1'队长  '2'队员
        addIdList: [],                      // 要添加的团队成员的IdList
        ZXYY: '',                           // 删除原因
        YSTDCYID: '',                       // 删除的Id
        isShowDelete: false,
        women: this.defaultWomanImg,
        man: this.$defaultManImg,
        downloadUrl: this.$downloadUrl,                // 下载路径
      }
    },
    components: {
      teamMember,
      assignAlertDialog,
      commonSelector,
      commonTextArea
    },
    props: {
      teamId: {default: ''},                // teamId
      orgId: {default: ''},                 // orgId
      toggleContent: {}                     // 开关弹窗
    },
    watch: {
      isShowTeamMember(val) {
        if (val) {
          // 打开窗口时查询不在团队中的医生
          this.searchFreeDoctor()
        }
      }
    },
    methods: {
      /**
       * 关闭弹窗
       **/
      closeContent() {
        this.toggleContent(-1);
      },
      /**
       * 添加队长
       */
      addTeamLeader() {
        this.type = '1';
        this.toggleTeamMemberDialog()
      },
      /**
       * 添加成员
       */
      addTeamMember() {
        this.type = '2';
        this.toggleTeamMemberDialog()
      },
      /**
       * 开关选择团队/成员弹窗
       * @param fag
       */
      toggleTeamMemberDialog(fag) {
        if (fag === -1) {
          this.isShowTeamMember = false;
        } else {
          this.isShowTeamMember = !this.isShowTeamMember;
        }
        // 关闭弹窗清空List;
        if (!this.isShowTeamMember) {
          this.addIdList = [];
        }
      },
      /**
       * 选择团队/成员弹窗确认事件
       */
      confirmTeamMemberDialog() {
        let defIdList = this.addIdList;
        if (defIdList[0].TDJSDM === '1' && this.addIdList.length > 1) {
          this.$Message({
            message: '选择队长只能选一个！',
            type: 'error',
            duration: 3 * 1000,
            center: true
          });
          return
        }
        if (this.addIdList.length === 0) {
          this.$Message({
            message: '请选择成员添加',
            type: 'error',
            duration: 3 * 1000,
            center: true
          });
          return
        }
        let defPromise = defIdList.map(item => {
          return new Promise((res, rej) => {
            this.$post('family/teamAndMember/addMember', item).then(rsp => {
              res(rsp)
            }, reject => {
              rej(reject)
            })
          })
        });
        Promise.all(defPromise).then(rsp => {
          this.initData();
          this.toggleTeamMemberDialog(-1)
        }, rej => {
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }})

      },
      /**
       * 开关删除弹窗
       * @param fag
       */
      toggleDeleteDialog(fag) {
        if (fag === -1) {
          this.isShowDelete = false;
        } else {
          this.isShowDelete = !this.isShowDelete;
        }
        if(!this.isShowDelete){
          this.ZXYY = '';
        }
      },
      /**
       * 删除点击触发事件
       */
      deleteClick(YSTDCYID) {
        this.YSTDCYID = YSTDCYID;
        this.toggleDeleteDialog()
      },
      /**
       * 团队删除成员
       */
      deleteTeamMember() {
        const {YSTDCYID, ZXYY} = this;
        this.$post('family/teamAndMember/deleteMember', {
          YSTDCYID,
          ZXYY
        }).then(rsp => {
          this.initData();
          this.toggleDeleteDialog(-1)
        }, rej => {
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }})
      },
      /**
       * 查询不在团队中的医生
       */
      searchFreeDoctor() {
        this.$post('family/teamAndMember/getDoctors', {
          orgId: this.orgId
        }).then(rsp => {
          this.doctorList = rsp.datas;
        }, rej => {
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }})
      },
      /**
       * 改变idList
       * @param obj
       */
      changeAddIdList(obj) {
        let {addIdList} = this;
        let k = -1;
        addIdList.some((item, index) => {
          if (item.doctorId === obj.doctorId) {
            k = index;
            return true
          } else {
            return false
          }
        });
        if (k === -1) {
          addIdList.push(obj);
        } else {
          addIdList.splice(k, 1);
        }
        this.addIdList = addIdList;
      },
      /**
       * 初始化数据
       */
      initData() {
        // 编辑数据回显
        this.$post('family/teamAndMember/getByTDID', {
          TDID: this.teamId
        }).then(rsp => {
          let list = rsp.data.MEMBERS;
          let k = -1;
          list.some((item, index) => {
            if (item.TDJSDM === '1') {
              // 找到队长的信息
              this.leader = item;
              k = index;
              return true
            } else {
              return false
            }
          });
          // 剔除队长
          if (k !== -1) {
            list.splice(k, 1);
          } else {
            this.leader = '';
          }

          // 赋值为纯队员信息
          this.memberList = list;

          this.ORGID = rsp.data.ORGID;
        }, rej => {
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }})
      }
    },
    created() {
      this.initData()
    }
  }
</script>

<style lang="scss">
@import "../style/addNewTeamMember.scss";
</style>
