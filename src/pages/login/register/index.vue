<template>
<div class="home">
  <p class="title">{{titleName}}</p>
  <div class="form">
    <div class="input">
      <span>手机号码</span><span class="line">|</span><input v-model="info.mob" type="number" maxlength="11" placeholder="请输入手机号码" />
    </div>
    <div class="input">
      <span>真实姓名</span><span class="line">|</span><input v-model="info.realNm" type="text" placeholder="请输入真实姓名"/>
    </div>
    <div class="input">
      <span>登录密码</span><span class="line">|</span><input v-model="info.password"  type="password" placeholder="请输入登录密码"/>
    </div>
    <div class="input" style="border-bottom: none">
      <span>确认密码</span><span class="line">|</span><input v-model="password"  type="password" placeholder="请再次输入登录密码"/>
    </div>
  </div>
  <button @click="register">注册</button>
  <span class="toRegistered" @click="toPage('/pages/login/index/main')">登录</span>
</div>
</template>

<script>
  export default {
    data() {
      return {
        info:{
          mob:'',
          password:'',
          realNm:'',
        },
        password: '',
        titleName:'嘉平安',//标题名称
      };
    },
    onUnload(){
      this.info={}
    },
    async onShow() {
      this.getxmmc();
    },
    onShareAppMessage (res) {
      return {
        title: '注册',
        desc: "注册",
        path: '/pages/login/register/main'
      }
    },
    methods: {
      async getxmmc(){
        let data = await this.api.xmmc()
        this.titleName = data
      },
      register(){
        let news =  this.reg.checkPhone(Number(this.info.mob))
        if(news != 'ok'){
          wx.showToast({
            title: news, // 标题
            icon: 'none',  // 图标类型，默认success
            duration: 1000  // 提示窗停留时间，默认1500ms
          })
        }else{
          if(this.password != this.info.password){
            wx.showToast({
              title: '两次密码不相同！', // 标题
              icon: 'none',  // 图标类型，默认success
              duration: 1000  // 提示窗停留时间，默认1500ms
            })
          }else{
            this.api.register(this.info).then(res=>{
              if(res.code == 0){
                if(!wx.getStorageSync('yui3-token')){
                  let data = res.data.token;
                  let userInfo = res.data.userInfo;
                  wx.setStorageSync('yui3-token',data)
                  wx.setStorageSync('userInfo',userInfo)
                }
                wx.showToast({
                  title: '注册成功！', // 标题
                  icon: 'success',  // 图标类型，默认success
                  duration: 1500  // 提示窗停留时间，默认1500ms
                })
                setTimeout(()=>{
                  this.toLogin('/pages/login/index/main'
                  )},1000)
              }else{
                wx.showToast({
                  title:res.msg,
                })
              }
            })
          }
        }

      },
      toPage(url) {
        this.until.aHref(url)
      },
      changeActive(e){
        this.cd = e.cd
      },
      //跳转至登录页面
      toLogin(url) {
        wx.reLaunch({url})
      },
    }
  }
</script>
<style scoped lang="less">
  .home{
    height: 100vh;
    width: 100vw;
    background-image: url("
http://oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/pfyf/a9e7b2d3edbe4337902f059f5ff2eacd.png");
    background-repeat:no-repeat;
    background-size:100% 100%;
    .title{
      width: 100%;
      font-size: 48rpx;
      text-align: center;
      padding-top: 105rpx;
      color: #FFFFFF;
      margin-bottom: 161rpx;
    }
    .toRegistered{
      font-size: 30rpx;
      color: #606060;
      padding-left: 620rpx;
    }
    .form{
      display: flex;
      flex-direction: column;
      background-color: #FFFFFF;
      margin: 0 40rpx 0 40rpx;
      height: 439rpx;
      border-radius: 20rpx;
      padding: 0 30rpx;
      .input{
        display: flex;
        height: 110rpx;
        border-bottom: 2rpx solid #CDCDCD;
        >span{
          font-size: 30rpx;
          line-height: 110rpx;
          height: 110rpx;
          width: 120rpx;
        }
        >input{
          height: 110rpx;
          line-height: 110rpx;
          width: 400rpx;
        }
        .line{
          margin: 0 20rpx;
          width: fit-content;
          color: #CECECE;
        }
      }
    }
    button{
      margin-top: 61rpx;
      width: 670rpx;
      height: 82rpx;
      background-color: #E75152;
      color: #FFFFFF;
      border-radius: 40rpx;
      margin-bottom: 40rpx;
    }

  }

</style>
