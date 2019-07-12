<template>
  <div class="assignSignerInfo">
    <p class="assignSignerTitle">
      <span class="title">签约信息</span>
    </p>
    <div class="signServiceInfo">
      <div class="serviceTableRow">
        <div class="serviceTableCell name">签约机构</div>
        <div class="serviceTableCell detail">{{signerInfo.DJJGMC}}</div>
      </div>
      <div class="serviceTableRow">
        <div class="serviceTableCell name">签约团队</div>
        <div class="serviceTableCell detail">{{signerInfo.TDMC}}</div>
      </div>
      <div class="serviceTableRow">
        <div class="serviceTableCell name">个人合付</div>
        <div class="serviceTableCell detail">
          0元
          <!--<a href="#" class="lookDetail" @click.stop.prevent="toggleMainContent">查看明细</a>-->
        </div>
      </div>
      <div class="serviceTableRow">
        <div class="serviceTableCell name">申请时间</div>
        <div class="serviceTableCell detail">{{signerInfo.CREATETIME}}</div>
      </div>
      <div class="serviceTableRow">
        <div class="serviceTableCell name">签约渠道</div>
        <div class="serviceTableCell detail">{{signerInfo.SOURCE}}</div>
      </div>
      <div class="serviceTableRow">
        <div class="serviceTableCell name">服务周期</div>
        <div class="serviceTableCell detail">{{signerInfo.QYRQ}}<i>至</i>{{signerInfo.DQRQ}}</div>
      </div>
      <div class="serviceTableRow">
        <div class="serviceTableCell name">解约时间</div>
        <div class="serviceTableCell detail">{{signerInfo.JYRQ}}</div>
      </div>
      <div class="serviceTableRow">
        <div class="serviceTableCell name">签约状态</div>
        <div class="serviceTableCell detail"><span>{{signerInfo.ORDERSTATUSNAME}}</span></div>
      </div>
      <div class="serviceTableRow">
        <div class="serviceTableCell name">解约原因</div>
        <div class="serviceTableCell detail">{{signerInfo.JYYY}}</div>
      </div>
      <div class="serviceTableRow">
        <div class="serviceTableCell name">签约协议</div>
        <div class="serviceTableCell detail">
          <a href="#"
             class="print highlight"
             v-if="signStatus=== 1"
             @click.prevent.stop="printPdf"
          >
            打印
            <i class="printing"></i>
          </a>
          <span class="print" v-if="signStatus !== 1">打印 <i class="printed"></i></span>
        </div>
      </div>
    </div>
    <div class="btns" v-if="isShowSign">
      <el-button type="primary" class="major" v-if="signStatus === 0" @click.prevent.stop="toggleSignDialog">通过
      </el-button>
      <el-button type="danger" v-if="signStatus === 0" @click.prevent.stop="toggleRejctDialog" class="reject">拒绝</el-button>
      <el-button type="info" v-if="signStatus === 2" plain disabled class="refused">已拒绝</el-button>
      <el-button type="info" v-if="signStatus === 3" plain disabled class="canceled">已取消</el-button>
      <el-button type="info" v-if="signStatus === 4" plain disabled class="retracted">已解约</el-button>
      <el-button type="info" v-if="signStatus === 5" plain disabled class="overTimed">已过期</el-button>
      <el-button type="danger" class="cancel" v-if="signStatus === 1" @click.prevent.stop="toggleTerminateDialog">解约
      </el-button>
    </div>
    <!-- 服务包弹窗开始 -->

    <assignChargeInfo
      :isShow="isShowServicePackage"
      :toggleMainContent='toggleMainContent'
    >
    </assignChargeInfo>
    <!-- 服务包弹窗结束 -->

    <!-- 通过签约弹窗开始 -->
    <assignAlertDialog
      :title="'通过签约'"
      :isShowDialog="isShowSignFile"
      :toggleContent="toggleSignDialog"
      :confirmDialog="confirmRetract"
    >
      <div class="paddingBox">是否确定通过签约</div>
    </assignAlertDialog>
    <!-- 通过签约弹窗结束 -->

    <!-- 拒绝弹窗开始 -->
    <assignAlertDialog
      :title="'拒绝'"
      :isShowDialog="isShowReject"
      :toggleContent="toggleRejctDialog"
      :confirmDialog="refuseRetract"
    >
      <div class="paddingBox nonePaddingBottom">
        <commonSelector :options="rejectList" v-model="rejectReason" :text="'拒绝原因'"></commonSelector>
      </div>
    </assignAlertDialog>
    <!-- 拒绝弹窗结束 -->

    <!-- 解约弹窗开始 -->
    <assignAlertDialog
      :title="'解约'"
      :isShowDialog="isShowTerminate"
      :toggleContent="toggleTerminateDialog"
      :confirmDialog="retractFile"
    >
      <div class="paddingBox nonePaddingBottom">
        <commonTextArea v-model="JYYY" :text="'解约原因'"></commonTextArea>
      </div>
    </assignAlertDialog>
    <!-- 解约弹窗结束 -->

    <!-- 打印的内容开始 -->
    <iframe class="myIframe" frameborder=0 name="showHere" scrolling=auto src="">
      <pdfPrint
        ref="print"
        :PARTYA="pdfInfo.PARTYA"
        :PARTYB="pdfInfo.PARTYB"
        :SFZJH="pdfInfo.SFZJH"
        :LXDH="pdfInfo.LXDH"
        :JTZZ="pdfInfo.JTZZ"
        :TDMC="pdfInfo.TDMC"
        :TDCYList="pdfInfo.TDCYList"
        :TDZRYS="pdfInfo.TDZRYS"
        :TDLXDH="pdfInfo.TDLXDH"
        :QYFWList="pdfInfo.QYFWList"
        :JTCYList="pdfInfo.JTCYList"
      >
      </pdfPrint>
    </iframe>
    <!-- 打印的内容结束 -->
  </div>
</template>

<script>
  import commonDialog from './commonDialog';                             // 公共弹窗
  import assignChargeInfo from './assignChargeInfo';                     // 费用详情弹窗
  import assignAlertDialog from './assignAlertDialog';                  // 通过/拒绝弹窗组件
  import commonSelector from './commonSelector';                        // 公共选择器
  import commonTextArea from './commonTextArea';
  import pdfPrint from '@/components/pdfPrint';                          // pdf打印组件

  const APPROVAL_LIST = [0, 1, 2];                                // 可以展示审批的字段
  let timer = 'pdfTimer';                                       //

  export default {
    name: "assignSignerInfo",
    components: {
      assignChargeInfo,
      commonDialog,
      assignAlertDialog,
      commonSelector,
      commonTextArea,
      pdfPrint
    },
    data() {
      return {
        isShowServicePackage: false,          // 是否展示服务包弹窗
        isShowSignFile: false,                // 是否展示通过签约
        isShowReject: false,                  // 是否展示拒绝弹窗
        isShowTerminate: false,               // 是否展示解约窗口
        rejectList: [{                        // 拒绝理由的List
          value: '1',
          label: '非辖区常驻居民'
        }, {
          value: '2',
          label: '联系不上签约人'
        }, {
          value: '3',
          label: '健康档案资料有误'
        }
        ],
        rejectReason: '',                    // 拒绝原因
        terminationPerson: '',               // 解约人
        terminationList: [                   // 解约人
          {
            value: '1',
            label: '张三'
          },
          {
            value: '2',
            label: '王五'
          }
        ],
        JYYY: '',                        // 解约原因
        pdfInfo: {}
      }
    },
    props: {
      signerInfo: {
        default: () => {
        }
      },         // 签约信息
      QYID: '',                             // 签约ID
      signStatus: {default: 0},            // 签约状态 0代表待审核，1代表已签约，2代表已拒绝，3已取消，4已解约，5已过期
      isShowSign: {default: false}           // 是否展示审批签约
    },
    methods: {
      /**
       * 赛事筛选框的隐藏与显示
       * @param fag
       */
      toggleMainContent(fag) {
        // if (fag === -1) {
        //   this.isShowServicePackage = false;
        // } else {
        //   this.isShowServicePackage = !this.isShowServicePackage;
        // }
      },
      /**
       * 开关是否签约小弹窗
       * @param fag type:string
       **/
      toggleSignDialog(fag) {
        if (fag === -1) {
          this.isShowSignFile = false;
        } else {
          this.isShowSignFile = !this.isShowSignFile;
        }
      },
      /**
       * 开关是否拒绝小弹窗
       * @param fag type:string
       **/
      toggleRejctDialog(fag) {
        if (fag === -1) {
          this.isShowReject = false;
        } else {
          this.isShowReject = !this.isShowReject;
        }
      },
      /**
       * 开关是否解约小弹窗
       * @param fag type:string
       **/
      toggleTerminateDialog(fag) {
        if (fag === -1) {
          this.isShowTerminate = false;
        } else {
          this.isShowTerminate = !this.isShowTerminate;
        }
      },
      /**
       * 确定签约
       */
      confirmRetract() {
        this.$emit('setEvent', {val: 1, callback: this.toggleSignDialog});
      },
      /**
       * 取消签约
       */
      refuseRetract() {
        this.$emit('setEvent', {val: 2, res: this.rejectReason, callback: this.toggleRejctDialog});
      },
      /**
       * 解约触发事件
       */
      retractFile() {
        const {QYID, JYYY} = this;
        this.$post('family/sign/order/cancelSignFamily',{QYID, JYYY}).then(rsp=>{
          this.$emit('setSignStatus', 4);
          this.toggleTerminateDialog();
          // this.$emit('initData');
          this.$emit('closeDialog');
        }, rej=>{
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }
        })
      },
      /**
       * 打印
       */
      printPdf(){
        const {QYID} = this;
        this.$post('family/sign/order/buildPdf',{QYID}).then(rsp=>{
          this.pdfInfo = rsp.data;
          clearTimeout(timer);
          timer = setTimeout(()=>{
            this.$print(this.$refs.print.$el);
          }, 1000);
        }, rej=>{
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  .assignSignerInfo {
    .paddingBox {
      padding: 30px 0;
    }
    .myIframe{
      height: 0;
    }

    .nonePaddingBottom {
      padding-bottom: 0;

      .commonSelector {
        display: flex;
        line-height: 30px;

        .iconText {
          width: 80px;
          text-align: right;
        }
      }
    }

    .assignSignerTitle {
      text-align: left;
      font-weight: bold;
      font-size: 18px;
      padding-top: 28px;
      padding-bottom: 20px;
    }

    .signServiceInfo {
      display: table;
      border-top: 1px solid #DDDDDD;
      border-left: 1px solid #DDDDDD;
      box-sizing: border-box;

      .serviceTableRow {
        display: table-row;

        .serviceTableCell {
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 16px;
          border-right: 1px solid #DDDDDD;
          border-bottom: 1px solid #DDDDDD;
          box-sizing: border-box;
          display: table-cell;

          &.name {
            width: 114px;
          }

          &.detail {
            width: 1178px;
            text-align: left;
            text-indent: 23px;
          }

          .lookDetail {
            color: #29CB97;
            margin-left: 11px;
          }

          .print {
            color: #4486FF;
            opacity: 0.3;
            .printing{
              height: 16px;
              width: 16px;
              display: inline-block;
              vertical-align: middle;
              background: url("../assets/ic_printing_on.png") no-repeat;
              background-size: contain;
            }
            .printed{
              height: 16px;
              width: 16px;
              display: inline-block;
              vertical-align: middle;
              background: url("../assets/ic_printing_off.png") no-repeat;
              background-size: contain;
            }

            &.highlight {
              opacity: 1;
            }
          }
        }
      }
    }

    .btns {
      padding: 30px 0;
      text-align: left;

      .major {
        margin-right: 20px !important;
        background-color: #4486ff;
      }
      .reject{
        background-color: #F65860;
      }

      .el-button {
        padding: 0 0;
        margin: 0 0;
        width: 86px;
        height: 30px;
        line-height: 30px;
      }
      .refused, .canceled, .retracted, .overTimed {
        color: #F65860;
        line-height: 30px;
      }
    }

  }
</style>
