<template>
  <div class="commonTextArea">
    <i class="iconText">{{text}}</i>
    <el-input
      class="selection"
      type="textarea"
      :placeholder="placeholderText"
      v-model="textarea"
      maxlength="300"
      resize="none"
      show-word-limit
      :disabled="isDisabled"
    >
    </el-input>
  </div>
</template>

<script>
  export default {
    name: "commonTextArea",
    data() {
      return {
        textarea: this.value
      }
    },
    props: {
      value: {default: ''},                      // 双向绑定value
      text: {default: ''},                      // title
      isDisabled: {default: false},             // 是否可编辑
      placeholderText: {default: '请输入内容'}
    },
    watch: {
      value(val) {
        this.textarea = val;
      },
      textarea(val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="scss">
  @import "../../style/commonTextArea.scss";
</style>
