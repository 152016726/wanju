<template>
  <div class="commonDatePicker clearfix">
    <i class="fl iconText">{{text}}</i>
    <el-date-picker
      class="datepicker fl"
      v-model="dateValue"
      :disabled="isDisabled"
      :picker-options="pickerOptions"
      type="date"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      :placeholder="placeholderText"
      :class="[toggleFlag ? 'closeIcon' : 'openIcon' ]"
      v-on:focus="toggleState"
      v-on:blur="toggleState"
    >
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    name: "commonDatePicker",
    data() {
      return {
        dateValue: this.value,
        toggleFlag: false
      }
    },
    props: {
      value: {default: ''},                     // 双向绑定value
      text: {default: ''},                      // title
      isDisabled: {default: false},             // 是否可编辑
      placeholderText: {default: '选择日期'},
      pickerOptions: {default:()=>{}}           // 日期筛选方法
    },
    watch:{
      value(val) {
        this.textValue = val;
      },
      dateValue(val){
        // console.log(val, 'date');
        this.$emit('input', val)
      }
    },
    methods: {
      toggleState(){
        this.toggleFlag = !this.toggleFlag;
      }
    }
  }
</script>

<style lang="scss">
  .commonDatePicker {
    line-height: 30px;
    height: 60px;

    i {
      font-size: 16px;
    }

    .datepicker {
      margin-left: 10px;
      width: 200px;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      box-sizing: border-box;
    }
    input{
      &::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #BABABA;
      }

      &:-moz-placeholder, textarea:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #BABABA;
      }

      &::-moz-placeholder, textarea::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #BABABA;
      }

      &:-ms-input-placeholder, textarea:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #BABABA;
      }
    }

    .el-input__inner {
      height: 30px;
      line-height: 30px;
      text-indent: 8px;
      padding: 0 0 !important;
      margin: 0 0 ;
      border-radius: 4px;
    }

    .el-icon-date{
      display: none;
    }
    .el-input__icon{
      &::before{
        display: none !important;
      }
    }

    .openIcon, .closeIcon{
       &::before{
         display: block;
         content: '';
         position: absolute;
         right:12px;
         top: 50%;
         transform: translateY(-50%);
         width: 16px;
         height: 14px;
         background: url("../assets/btn_time.png") no-repeat center center;
         background-size: cover;
       }
    }

  }
</style>
