<template>
<div class="home">
  <div class="header">
    <ul>
      <li><p>手机号码<span></span></p><span>|</span><p style="font-weight: normal;">{{info.mob}}</p></li>
      <li><p>原密码<span></span></p><span>|</span><input type="password" placeholder="请输入原密码" v-model="passwordInfo.password"/></li>
      <li><p>新密码<span></span></p><span>|</span><input type="password" placeholder="请输入新密码" v-model="passwordInfo.newPassword"/></li>
      <li><p>确认密码<span></span></p><span>|</span><input type="password" placeholder="请再次输入新密码" v-model="newPasswordAgain"/></li>
    </ul>
  </div>
  <div class="foot">
    <button @click="changePassword">提交</button>
  </div>
</div>
</template>

<script>
  export default {
    data(){
      return{
        info:{
          id:'',
          mob:'',
        },
        passwordInfo:{
          mob:'',
          password:'',
          newPassword:'',
        },
        newPasswordAgain:'',
      }
    },
    async onShow(){
      this.info.id = wx.getStorageSync("userInfo").id
      this.getCompany();
    },
    onShareAppMessage (res) {
      return {
        title: '更改密码',
        desc: "更改密码",
        path: '/pages/my/password/main'
      }
    },
    methods:{
      //查询我的个人信息
      async getCompany(){
        let data = await this.api.myCompany(this.info.id)
        //个人信息
        this.info = data.data
      },
      //跳转至登录页面
      toPage(url) {
        wx.reLaunch({url})
      },
      //修改我的密码
      changePassword(){
        this.passwordInfo.mob = this.info.mob;
        if(this.passwordInfo.newPassword == this.passwordInfo.password){
          wx.showToast({
            title: '新密码不能与旧密码相同！', // 标题
            icon: 'none',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
        }else if(this.newPasswordAgain != this.passwordInfo.newPassword){
          wx.showToast({
            title: '两次密码不相同', // 标题
            icon: 'none',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
        }else{
          this.api.password(JSON.stringify(this.passwordInfo)).then(res=>{
            wx.showToast({
              title: '修改成功！', // 标题
              icon: 'success',  // 图标类型，默认success
              duration: 1500  // 提示窗停留时间，默认1500ms
            })
            setTimeout(()=>{
              this.toPage('/pages/login/index/main')
            },1000)
          })
        }

      },
    }
  }
</script>
<style scoped lang="less">
  .home{
    height: 100vh;
    width: 100vw;
    background-color: rgba(245, 245, 245, 0.58);
    padding: 10rpx 20rpx;
    box-sizing: border-box;
    .header{
      background-color: #FFFFFF;
      border-radius: 10rpx;
      width: 710rpx;
      height: 443rpx;
      ul{
        display: flex;
        flex-direction: column;
      }
      ul li{
        display: flex;
        padding: 10rpx 32rpx;
        &:first-of-type{
          margin-top: 35rpx;
        }
        p{
          width: 120rpx;
          font-size: 30rpx;
          text-align: justify;
          color: #303030;
          font-weight: bold;
          >span{
            display: inline-block;
            width: 100%;
          }
        }
        >span{
          color: #BBCBE7;
          margin: 0 20rpx;
        }
        >input{
          flex: 1;
        }
      }
    }
    .foot{
      width: 710rpx;
      margin-top: 70rpx;
      button{
        background-color: #74A8FF;
        color: #FFFFFF;
        font-size: 30rpx;
        border: none;
        border-radius: 40rpx;
        height: 82rpx;
      }
    }
  }

</style>
