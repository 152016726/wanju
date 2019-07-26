<template>
  <div class="commonSelector clearfix">
    <i class="fl iconText">{{text}}</i>
    <el-select v-model="selectValue" :placeholder="placeholderText" :disabled="isDisabled" class="selection fl">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: "commonSelector",
    data() {
      return {
        selectValue: this.value
      }
    },
    props: {
      value: {default: ''},                      // 双向绑定value
      text: {default: ''},                      // title
      isDisabled: {default: false},             // 是否可编辑
      options: {default: () => []},             // selection数组
      placeholderText: {default: '请选择'}
    },
    watch: {
      value(val){
        this.selectValue = val;
      },
      selectValue(val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="scss">
@import "../../style/commonSelector.scss";
</style>
