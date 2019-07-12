<template>
  <!-- 导航菜单 -->
  <div class="navs">
    <el-menu
      :default-active="orderPage"
      class="el-menu-vertical-demo"
      :unique-opened="true"
      background-color="#304156"
      text-color="#fff"
      active-text-color="#669cfd"
    >
      <div v-for="(item, index) in asideList" :key="index">

        <el-submenu :index="index+'-'+0" v-if="item.items && item.flag">
          <!-- 有展开项的情况开始 -->
          <template slot="title">
            <div class="tabTitle" @click="item.items ? '' : tabClick(item.url)">
              <i class="tag" :style="{backgroundImage: 'url('+item.iconSrc+')'}"></i>
              <span>{{item.name}}</span>
            </div>
          </template>
          <el-menu-item-group v-for="(val, k) in item.items" :key="val.name+k">
            <el-menu-item :index="index+'-'+ k" v-if="val.flag" @click="tabClick(val.url)">
              {{val.name}}
            </el-menu-item>
          </el-menu-item-group>
          <!-- 有展开项的情况结束 -->
        </el-submenu>

        <!-- 无展开项的情况开始 -->
        <el-menu-item v-if="!item.items && item.flag" :index="index+'-'+0">
          <div class="tabTitle" @click="item.items ? '' : tabClick(item.url)">
            <i class="tag" :style="{backgroundImage: 'url('+item.iconSrc+')'}"></i>
            <span>{{item.name}}</span>
          </div>
        </el-menu-item>
        <!-- 无展开项的情况结束 -->

      </div>

    </el-menu>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import home from '@/assets/ic_home.png';
  import sign from '@/assets/ic_signing.png';
  import account from '@/assets/ic_account.png';
  import team from '@/assets/ic_team.png';
  import service from '@/assets/ic_service.png';
  import weixinDigg from '@/assets/ic_public.png';
  import settings from '@/assets/ic_system.png';

  export default {
    name: "asside",
    data() {
      return {
        asideList: [
          // {name: '首页', iconSrc:home, url: './', flag:true, iconSrc: home},
          {name: '签约管理', iconSrc: sign, url: '/', flag:true, items: [{name: '签约列表', flag:true, url: '/'}]},
          {name: '账号管理', iconSrc: account,url: '/roleManage', flag:true, items: [{name: '角色列表', flag:true, url: '/roleManage'},{name: '账号列表', flag:true, url: '/accountManage'}]},
          {name: '团队管理', iconSrc: team,url: '/memberManage', flag:true, items: [{name: '医生列表', flag:true, url: '/memberManage'}, {name: '团队列表', flag:true, url: '/teamManage'}]},
          // {name: '服务包管理', iconSrc: service, url: '/servicePackage', flag:true, items: [{name: '服务包管理', flag:true, url: '/servicePackage'}]},
          // {name: '公众号管理', iconSrc: weixinDigg, url: '/weixinDiggList', flag:true, items: [{name: '公众号列表', flag:true, url: '/weixinDiggList'}, {name: '公众号资讯', flag:true, url: '/weixinDiggInfo'}]},
          {name: '系统设置', iconSrc: settings, url: '/version', flag:true,items: [{name: '版本管理', flag: true, url: '/version'}]}
        ]
      }
    },
    watch:{
      statusSet(val){
        if(val){
          this.initData()
        }
      }
    },
    computed: {
      ...mapState([
        'orderPage'
      ]),
      statusSet(){
        return this.$store.state.isLogin
      }
    },
    methods: {
      /**
       * 左侧点击路由事件
       * @param url  提供跳转路由
       */
      tabClick(url) {
        this.$router.push({
          path: url
        })
      },
      initData(){
        let authObj = JSON.parse(this.$localStore.getItem('authority'));
        if(!!authObj){
          // this.asideList[0].flag = authObj['index'];
          // this.asideList[1].flag = authObj['sign_list'];
          // this.asideList[2].flag = authObj['role_list'] || authObj['account_list'];
          // this.asideList[3].flag = authObj['team_member_list'] || authObj['team_list'];
          // this.asideList[4].flag = authObj['wx_secret_list'] || authObj['wx_news_list'];
          let arr = this.asideList;
          // 签约列表
          arr[0].flag = authObj['sign_list'];
          // 账号管理
          arr[1].flag = authObj['role_list'] || authObj['account_list'];
          arr[1].items[0].flag = authObj['role_list'];
          arr[1].items[1].flag = authObj['account_list'];
          // 团队管理
          arr[2].flag = authObj['team_member_list'] || authObj['team_list'];
          arr[2].items[0].flag = authObj['team_member_list'];
          arr[2].items[1].flag = authObj['team_list'];
          // // 公众号管理
          // arr[3].flag = authObj['wx_secret_list'] || authObj['wx_news_list'];
          // arr[3].items[0].flag = authObj['wx_secret_list'];
          // arr[3].items[1].flag = authObj['wx_news_list'];
          // 版本管理
          arr[3].flag = authObj['version_list'];
          arr[3].items[0].flag = authObj['version_list'];
          this.asideList = arr;
        }
      }
    },
    created() {
      this.initData()
    }
  }
</script>

<style lang="scss" scoped>
  .navs {
    background-color: #304156;
    display: flex;
    height: 100%;
    box-sizing: border-box;
    .el-menu{
      width: 100%;
      padding: 10px 10px;
      border: none;
      .el-submenu{
        line-height: 40px;
        margin-bottom: 10px;
      }
      .tabTitle{
        cursor: pointer;
      }
      .el-menu-item{
        padding: 0 10px !important;
        font-size: 18px !important;
        height: 40px;
        line-height: 40px;
        margin-bottom: 10px;
        span{
          margin-left: 10px;
        }
      }
      .el-menu-item-group{
        .el-menu-item{
          font-size: 18px;
          margin: 0 10px;
          margin-top: 10px;
          text-align: center;
        }
      }
      .is-active{
        background-color: #4486FF!important;
        color: #ffffff!important;
      }
      .el-menu-item:hover{
        background-color: #4486FF!important;
      }
    }
    .tag {
      width: 20px;
      height: 20px;
      vertical-align: middle;
      display: inline-block;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
    }
  }
</style>
