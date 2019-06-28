<template>
  <!-- 导航菜单 -->
  <div class="navs">
    <ul class="list-unstyled">
      <li v-for="(item, index) in asideList" :key="index" v-if="item.flag">
        <!-- XXX包管理父项开始 -->
        <a href="#"
           :class="{active: +orderPage.split('-')[0] === index}"
           @click.prevent="tabClick(item, index)"
        >
          <div class="info">
            <i class="tag" :style="{backgroundImage: 'url('+item.iconSrc+')'}"></i>
            <span>{{item.name}}</span>
          </div>
          <i class="icon"
             v-if="index !==0 && item.items "
             :style="{backgroundImage: 'url('+(+orderPage.split('-')[0] === index && flag ? tabImg : openImg)+')'}"></i>
        </a>
        <!-- XXX包管理父项结束 -->

        <!-- XXX包管理子项展开开始 -->
        <div class="subAsideList" v-if="item.items && +orderPage.split('-')[0] === index && flag">
          <a v-for="(val, key) in item.items"
             :key="key" class="subItem"
             :class="{active: +orderPage.split('-')[1] === key }"
             @click.prevent="tabSubClick(val)"
             v-if="val.flag"
          >
            <span>{{val.name}}</span>
          </a>
        </div>
        <!-- XXX包管理子项展开结束 -->
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import home from '@/assets/ic_home.png';
  import account from '@/assets/ic_account.png';
  import team from '@/assets/ic_team.png';
  import service from '@/assets/ic_service.png';
  import weixinDigg from '@/assets/ic_public.png';
  import settings from '@/assets/ic_system.png';
  import openImg from '@/assets/btn_open.png';
  import tabImg from '@/assets/btn_retract.png';

  export default {
    name: "asside",
    data() {
      return {
        asideList: [
          // {name: '首页', url: './', flag:true, iconSrc: home},
          {name: '签约管理', iconSrc: home,url: '/', flag:true, items: [{name: '签约列表', flag:true, url: '/'}]},
          {name: '账号管理', iconSrc: account,url: '/roleManage', flag:true, items: [{name: '角色列表', flag:true, url: '/roleManage'},{name: '账号列表', flag:true, url: '/accountManage'}]},
          {name: '团队管理', iconSrc: team,url: '/memberManage', flag:true, items: [{name: '医生列表', flag:true, url: '/memberManage'}, {name: '团队列表', flag:true, url: '/teamManage'}]},
          // {name: '服务包管理', iconSrc: service, url: '/servicePackage', flag:true, items: [{name: '服务包管理', flag:true, url: '/servicePackage'}]},
          {name: '公众号管理', iconSrc: weixinDigg, url: '/weixinDiggList', flag:true, items: [{name: '公众号列表', flag:true, url: '/weixinDiggList'}, {name: '公众号资讯', flag:true, url: '/weixinDiggInfo'}]},
          // {name: '系统设置', iconSrc: settings}
        ],
        flag: true,        // 开关展开项
        openImg,
        tabImg
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
       * @param item  提供跳转路由
       * @param index 索引
       */
      tabClick(item, index) {
        if(index === +this.orderPage.split('-')[0]){
          this.flag = !this.flag;
        }else{
          this.flag = true;
          let url = '';
          item.items.some((val)=>{
            if(val.flag){
              url = val.url;
              return true
            }else{
              return false
            }
          });
          this.$router.push({
            path: url
          })
        }
      },
      /**
       * 子项点击事件
       * @param item
       * @param index
       */
      tabSubClick(item, index){
        if(index === +this.orderPage.split('-')[0]){
          this.flag = !this.flag;
        }else{
          this.flag = true;
          this.$router.push({
            path: item.url
          })
        }
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
          arr[0].flag = authObj['sign_list'];
          arr[1].flag = authObj['role_list'] || authObj['account_list'];
          arr[1].items[0].flag = authObj['role_list'];
          arr[1].items[1].flag = authObj['account_list'];
          arr[2].flag = authObj['team_member_list'] || authObj['team_list'];
          arr[2].items[0].flag = authObj['team_member_list'];
          arr[2].items[1].flag = authObj['team_list'];
          arr[3].flag = authObj['wx_secret_list'] || authObj['wx_news_list'];
          arr[3].items[0].flag = authObj['wx_secret_list'];
          arr[3].items[1].flag = authObj['wx_news_list'];
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
    padding: 10px 10px;
    background-color: #304156;
    display: flex;
    height: 100%;
    box-sizing: border-box;

    .list-unstyled {
      width: 100%;

      li {
        width: 100%;
        /*width: 180px;*/
        font-size: 18px;
        color: #ffffff;
        padding-bottom: 10px;
        transition: height 2s;
        -moz-transition: height 2s; /* Firefox 4 */
        -webkit-transition: height 2s; /* Safari 和 Chrome */
        -o-transition: height 2s; /* Opera */

        a {
          line-height: 40px;
          display: -webkit-flex;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;

          .info {
            display: -webkit-flex;
            display: flex;
            align-items: center;

            .tag {
              width: 20px;
              height: 20px;
              display: inline-block;
              background-repeat: no-repeat;
              background-position: center center;
              background-size: contain;
            }

            span {
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
              margin-left: 10px;
            }
          }

          .icon {
            width: 10px;
            height: 10px;
            display: inline-block;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
            transition: all 0.3s;
            -moz-transition: all 0.3s; /* Firefox 4 */
            -webkit-transition: all 0.3s; /* Safari 和 Chrome */
            -o-transition: all 0.3s; /* Opera */
          }

          &.active, &:hover {
            background-color: #669CFD;
          }
        }

        .subAsideList {
          line-height: 40px;
          padding: 0 10px;

          .subItem {
            display: block;
            text-indent: 30px;
            margin-top: 10px;

            span {
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }

            &.active, &:hover {
              background-color: #669CFD;
            }
          }
        }
      }

    }
  }
</style>
