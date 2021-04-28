<script>
export default {
  data(){
    return{
      noAuthorize:false
    }
  },
  onHide(){
    if(wx.getStorageSync('ifClose')=='no'){

      return
      }
    //小程序切后台时缓存数据清除，以防下次打开小程序时获取到的获取数据不是最新的，会导致出错
    // wx.removeStorageSync('sysUserInfo')
    wx.removeStorageSync('inviCd')
    // wx.removeStorageSync('token')
    wx.removeStorageSync('detailImg')
    wx.removeStorageSync('CNBActive');
    wx.removeStorageSync('cardList');
    wx.removeStorageSync("yuMem");
    console.log('小程序切到后台')
     console.log(wx.getStorageSync('cardList'))
  },
  onLaunch () {
      console.log("onLaunch 开始--------------")
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  onUnload(){
    wx.clearStorageSync()
  },
  created() {
    // console.log('creat')

    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
    console.log("created 开始--------------")
    let logs;
    if (mpvuePlatform === "my") {
      logs = mpvue.getStorageSync({ key: "logs" }).data || [];
      logs.unshift(Date.now());
      mpvue.setStorageSync({
        key: "logs",
        data: logs
      });
    } else {
      logs = mpvue.getStorageSync("logs") || [];
      logs.unshift(Date.now());
      mpvue.setStorageSync("logs", logs);
    }

  },


  async onShow(options) {
    // if(wx.getStorageSync('ifClose')=='no'){
    //   wx.setStorage({
    //     key:"ifClose",
    //     data:''
    //   })
    //   return
    // }
    this.noAuthorize = false
    // let goInfo = wx.getLaunchOptionsSync()
    // if(goInfo.query.inviCd){
    //   wx.setStorageSync("inviCd",goInfo.query.inviCd)
    // }
    // console.log('小程序切前台时的参数：======================')
    // console.log(goInfo)
    // console.log(options)
    // console.log('inviCd:'+options.query.inviCd)
    // console.log('scene:'+options.query.scene)
    // if(options.query.inviCd){
    //   wx.setStorageSync("inviCd",options.query.inviCd)
    // }
    // if(options.query.scene){
    //   wx.setStorageSync("inviCd",options.query.scene)
    // }


    var that = this;
    //登录以防token失效
    // console.log('token的保存时间')
    // console.log(wx.getStorageSync('tokenTime'))

    //缓存中有token，token时间并且距离现在不超过20小时，则不用重新获取token
    let time = 1000*60*60*20 //时间间距
    if(wx.getStorageSync('token') && wx.getStorageSync('tokenTime') && (new Date().getTime()-new Date(wx.getStorageSync('tokenTime')).getTime()<time) ){
      console.log('不需要获取token')
      that.api.getUser()

      getCartSelf(wx.getStorageSync('token'))  //购物车自营
      getCartOther(wx.getStorageSync('token'))  //购物车外来
      getMsg(wx.getStorageSync('token'))  //未读信息
      return
    }

    // console.log('需要获取token')
    // return
    //把失效的token去掉，以防出现token失效
    if(wx.getStorageSync('token')){
      wx.removeStorageSync('token')
    }
    // wx.login({
    //   success(res) {
    //     console.log('登录成功')
    //     if (res.code) {
    //       let param = {
    //         code: res.code
    //       };
    //       that.api.login(param).then(res=>{
    //         // console.log('获取token++++++++++++++')
    //         that.api.getUser(res)
    //
    //         // that.api.getGuideAd("detailImg");
    //         // that.api.carId()
    //         getCartSelf(res)  //购物车自营
    //         getCartOther(res)  //购物车外来
    //         getMsg(res)  //未读信息
    //       })
    //     }
    //   }
    // });



    //获取信息
    async function getMsg(token) {
      let msgData = await that.api.msgNoRead(token);
      that.store.commit('getMsg',msgData)
    }
    //获取购物车信息
    async function getCartSelf(token) {
      console.log('购物车数据')
      let qry = that.query.new();
      that.query.toW(qry, "gdType", 0, "EQ");
      that.query.toP(qry, 1, 100000, 1);
      let data = await that.api.getCartList(
        encodeURIComponent(that.query.toJsonStr(qry)),token
      );
      that.store.commit('getCartSelf',data)

    }
    async function getCartOther(token){
      let qry = that.query.new();
      that.query.toW(qry, "gdType", 1, "EQ");
      that.query.toP(qry, 1, 100000, 1);
      let data = await that.api.getCartList(
        encodeURIComponent(that.query.toJsonStr(qry)),token
      );
      that.store.commit('getCartOther',data)


    }

  },

  log() {
    // console.log(`log at:${Date.now()}`);
  },
  // globalData:{
  //
  //   token: '',
  //
  // },

};
</script>

