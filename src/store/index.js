import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// 公共的store
let defStore = new Vuex.Store({
  state: {
    orderPage: '0',                          // 当前页面的标记
    isLogin: false                           // 是否为登陆页面
  },
  mutations: {
    /**
     * 更新state数据
     * @param state
     * @param data
     */
    updateState(state, data) {
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          state[key] = data[key];
        }
      }
    },
    /**
     * 更新是否为登陆页面
     * @param state
     * @param flag
     */
    updateLoginState(state, flag){
      state.isLogin = flag;
    }
  },
  actions: {
    /**
     * 公共侧边栏的活跃page顺序
     * @param commit
     * @param orderPage  外部传入的page顺序
     */
    setDefaultOrderPage({commit}, orderPage) {
      if (orderPage) commit('updateState', {orderPage})
    },
    /**
     * 控制是否为Login页
     * @param commit
     * @param flag
     */
    setIsLoginState({commit}, flag){
      commit('updateLoginState', flag)
    }
  }
});

export default defStore;
