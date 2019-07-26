<template>
  <div class="commonDialog"
       v-if="isShowText || show"
  >
    <!--v-clickOutside="handleClose"-->
    <div class="tag" v-if="isShowText" @click.stop="toggleContent">
      <div class="icon" :style="{backgroundImage: 'url('+iconImg +')'}"></div>
      <span>{{text}}</span>
    </div>
    <div class="mc" v-if="show">
      <div class="mask" @click.stop="handleClose" :style="{zIndex: zIndex}"></div>
      <div class="outContent" :style="{zIndex: zIndex+1}">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   *需要调用这同时传show(是否显示内容)和toggleMainContent(内容的显示隐藏切换)
   */
  export default {
    name: "commonDialog",
    data() {
      return {
        zIndexBackUp: 1,

      }
    },
    props: {
      iconImg: {default: ''},        // 图标
      text: String,                  // 显示的文字
      show: {                        // 是否展示
        default: false
      },
      toggleMainContent: {},        // 内容的显示隐藏切换函数
      isShowText: {default: true}   // 是否外部需要展示用来操作的内容
    },
    computed: {
      zIndex: function () {
        if (this.show) {
          return this.zIndexBackUp + 100;
        } else {
          return this.zIndexBackUp;
        }
      }
    },
    directives: {
      //实现点击容器以外的地方隐藏容器
      clickOutside: {
        // 初始化指令
        bind(el, binding, vnode) {
          function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
              return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
              // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
              binding.value(e);
            }
          }

          // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
          el.__vueClickOutside__ = documentHandler;
          document.addEventListener('click', documentHandler);
        },
        unbind(el, binding) {
          // 解除事件监听
          document.removeEventListener('click', el.__vueClickOutside__);
          delete el.__vueClickOutside__;
        },
      }
    },
    methods: {
      /**
       * 显示或隐藏
       */
      toggleContent() {
        this.toggleMainContent();
      },
      /**
       * 点击容易以外的地方隐藏容器
       * @param e
       */
      handleClose(e) {
        this.toggleMainContent(1);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../style/commonDialog.scss";
</style>
