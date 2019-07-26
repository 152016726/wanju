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
  @import "../../style/commonDatePicker.scss";
</style>
