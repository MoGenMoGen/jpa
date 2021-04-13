<template>
<div class="home">
  <div class="header">
    <div class="cell">
      <p>头像<span></span></p><span>|</span>
      <open-data type="userAvatarUrl"  class="userImg"></open-data>
    </div>
    <ul>
      <li><p>微信昵称<span></span></p><span>|</span><open-data type="userNickName" class="userName"></open-data></li>
      <li><p>手机号码<span></span></p><span>|</span><input type="text" placeholder="请输入手机号码" v-model="info.mob"/></li>
      <li><p>真实姓名<span></span></p><span>|</span><input type="text" placeholder="请输入真实姓名" v-model="info.realNm"/></li>
      <li><p>性别<span></span></p><span>|</span>
        <picker class="select" :range="genderInfo" :value="index" @change="bindPickerChange">
          <p style="width: 100%;font-weight: normal;">{{sex ? sex : '请选择性别'}}<img style="float:right;width:38rpx;height: 22rpx;padding-top: 10rpx;" src="../../../../static/my/dropdown.png"/></p>
        </picker>
      </li>
    </ul>
  </div>
  <div class="foot">
    <button @click="postInfo">提交</button>
  </div>
</div>
</template>

<script>
  export default {
    data(){
      return{
        info:{sex:'',},
        sex:'',
        index: 0,
        genderInfo:["男","女"],
      }
    },
    async onShow(){
      this.getCompany();
    },
    onShareAppMessage (res) {
      return {
        title: "个人信息",
        desc: "个人信息",
        path: '/pages/my/myInfo/main'
      }
    },
    methods:{
      toPage(url){
        this.until.aHref(url)
      },
      toTab(url){
        // wx.switchTab({url})
        wx.reLaunch({url})
      },
      //查询我的个人信息
      async getCompany(){
        if(wx.getStorageSync("userInfo")){
          this.info = wx.getStorageSync("userInfo")
        }else {
          this.info = await this.api.myCompany(wx.getStorageSync("userId"))
        }
        this.sex = this.info.sex
        this.genderInfo.forEach((item,index)=>{
          if(item==this.info.sex){
            this.index = index
          }
        })
      },
      //性别更改
      bindPickerChange(e){
        this.index = e.mp.detail.value
        console.log(this.index)
        this.info.sex = this.genderInfo[this.index]
        this.sex = this.genderInfo[this.index]
        this.$set(this.info,'sex',this.info.sex)
        console.log(this.info.sex)
      },
      //提交个人信息修改
      postInfo(){
        let news =  this.reg.checkPhone(Number(this.info.mob))
        if(news != 'ok'){
          wx.showToast({
            title: news, // 标题
            icon: 'none',  // 图标类型，默认success
            duration: 1000  // 提示窗停留时间，默认1500ms
          })
        }else{
          this.api.upd(JSON.stringify(this.info)).then(res=>{
            if(res.code == 0){
              wx.showToast({
                title: '提交成功', // 标题
                icon: 'success',  // 图标类型，默认success
                duration: 1500  // 提示窗停留时间，默认1500ms
              })
              this.api.myCompany(this.info.id)
              setTimeout(()=>{
                this.toTab('/pages/my/index/main')
              },500)
            }else{
              wx.showToast({
                title: res.msg, // 标题
                icon: 'none',  // 图标类型，默认success
                duration: 1500  // 提示窗停留时间，默认1500ms
              })
            }
          })

        }
      }
    }
  }
</script>
<style scoped lang="less">
  .home{
    height: 100vh;
    width: 100vw;
    background-color: rgba(245, 245, 245, 0.58);
    padding: 20rpx 20rpx;
    box-sizing: border-box;
    .header{
      background-color: #FFFFFF;
      border-radius: 10rpx;
      width: 710rpx;
      height: 664rpx;
      .cell{
        height: 220rpx;
        display: flex;
        padding: 38rpx 32rpx;
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
        .userImg{
          border-radius: 100%;
          object-fit: cover;
          display: block;
          overflow: hidden;
          width: 140rpx;
          height: 140rpx;
        }
      }
      ul li{
        display: flex;
        padding: 5rpx 32rpx;
        .userName{
          flex: 1;
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
        .select{
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
