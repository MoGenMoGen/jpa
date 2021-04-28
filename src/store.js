import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    cartSelf:[],  //自有商品的购物车
    cartOther:[],  //外来商品购物车
    cartNum:0,  //购物车总数量
    msgTotal:0,  //未读信息总数量
    msgData:{},  //未读信息列表数据
    currentClassify:'',//当前需要显示的大类id，从首页或者优惠券跳转到分类页面时需要
    token:'',//token
  },
  mutations:{
    token:(state,data)=>{
      // console.log('保存===========')
      state.token = data
    },
    getClassify: (state,data) => {
      state.currentClassify = data
    },
    getMsg: (state,data) => {
      state.msgData = data
      state.msgTotal = 0;
      state.msgTotal =
        parseInt(data.actRecoCount) +
        parseInt(data.tranInfoCount) +
        parseInt(data.fridInfoCount) +
        parseInt(data.sysInfoCont);
    },
    getCartSelf:(state,data)=>{
      // console.log('保存购物车列表数据')
      state.cartSelf = data
      store.commit("getCartNum")
      console.log(state.cartSelf)
    },
    getCartOther:(state,data)=>{
      state.cartOther = data
      store.commit("getCartNum")
      console.log(state.cartOther)
    },
    getCartNum:(state)=>{
      // console.log('获取购物车总数')
      state.cartNum = 0
      state.cartNum += state.cartSelf.length
      state.cartNum += state.cartOther.length
      // console.log(state.cartNum)

    }
  },
});

export default {
  store
}
