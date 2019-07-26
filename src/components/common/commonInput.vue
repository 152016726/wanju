<template>
  <div class="commonInput clearfix" :class="{active: active}">
    <div class="icon fl">
      <div class="tag" :style="{backgroundImage: 'url('+(active ? inputing : inputImg) +')'}"></div>
    </div>
    <input type="text"
           class="inputType fl"
           v-model="val"
           v-if="!isPwd"
           autocomplete="off"
           :placeholder="placeholderText"
           v-on:blur="textOnblur"
           v-on:focus="textOnFocus"
           @keyup.enter="submitData"
    />
    <input
      type="password"
      class="inputType fl"
      autocomplete="off"
      v-model="val"
      :placeholder="placeholderText"
      v-if="isPwd"
      v-on:blur="textOnblur"
      v-on:focus="textOnFocus"
      @click.enter="submitData"
    />
  </div>
</template>

<script>
  export default {
    name: "commonInput",
    data() {
      return {
        val: this.value,               // value值双向绑定
        active: false            // 输入框活跃状态
      }
    },
    props: {
      value: {default: ''},               // type:string   描叙:props的双向绑定
      inputImg: {default: ''},            // type:string   描叙:左边未激活的小图标
      inputing: {default: ''},            // type:string   描叙:左边激活状态的小图标
      isPwd: {default: false},            // type:boolean  描叙: 是否为密码组件
      placeholderText: {default: ''},     // type:string   描述:placeholder
      // maxLength: {default: 20},           // type:number   描述:最大长度
    },
    watch: {
      val(str) {
        this.$emit('input', str)
      },
      value(item){
        this.val = item;
      }
    },
    methods: {
      /**
       * 失焦事件
       */
      textOnblur(){
          if(this.val === ''){
            this.active = false;
          }
      },
      /**
       * 聚焦事件
       */
      textOnFocus(){
        this.active = true;
      },
      /**
       * 回车触发事件
       */
      submitData(){
        this.$emit('submitData');
      }
    }
  }
</script>

<style lang="scss">
@import "../../style/commonInput.scss";
</style>
