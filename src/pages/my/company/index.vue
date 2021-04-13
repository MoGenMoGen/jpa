<template>
<div class="home">
  <div class="header">
    <ul>
      <li>
        <p>真实姓名</p>
        <span>|</span>
        <input type="text" v-model="info.realNm" disabled/>
        <button v-if="!info.realNm" @click="show_pro(0)">修改</button>
      </li>
      <li>
        <p>手机号码</p>
        <span>|</span>
        <input type="text" v-model="info.mob" disabled/>
      </li>
      <li>
        <p>归属单位</p>
        <span>|</span>{{type}}
        <input type="text" v-model="info.unit" disabled/>
        <button @click="show_pro(1)">修改</button>
      </li>
    </ul>
  </div>
  <p v-if="!info.realNm" class="remind">*请先完善真实姓名,再进行归属单位绑定</p>
  <!--<div class="foot">-->
    <!--<button>提交</button>-->
  <!--</div>-->

  <div class="modalMask" v-if="isModel">
    <div class="modalDialog">
      <div class="modalContent">
        <p class="title">提示</p>
        <p class="remind">*请先完善真实姓名,再进行归属单位绑定</p>
        <input placeholder="请输入真实姓名" v-model="info.realNm"/>
      </div>
      <div class="modalFooter">
        <div class="btnCancel" @tap="tapCancel">取消</div>
        <div class="btnConfirm" @tap="confirmSend">确定</div>
      </div>
    </div>
  </div>


</div>
</template>

<script>
  export default {
    data(){
      return{
        info:{
          id:'',
          realNm:'',
          mob:'',
          unit:''
        },
        isModel: false,
        val: "",

      }
    },
    async onShow(){
      this.isModel = false
      this.info.id = wx.getStorageSync("userInfo").id
      this.getInfo()
    },
    onShareAppMessage (res) {
      return {
        title: "绑定单位",
        desc: "绑定单位页",
        path: '/pages/my/company/main'
      }
    },
    methods:{
     async getInfo(){
       let data = await this.api.myCompany(this.info.id)
       this.info = data.data

      },
      toPage(url){
        this.until.aHref(url)
      },

      tapCancel() {
        console.log("取消");
        this.isModel = !this.isModel;
      },
      //  姓名确认
      confirmSend() {
        console.log("确认");
        this.api.upd(this.info).then(()=>{
          this.isModel = !this.isModel;
          this.getInfo()
        })

      },
      //打开弹窗
      show_pro(type) {
        if(type == 0){
          this.isModel = !this.isModel;
        }else if(type == 1){
          if(this.info.realNm){
            this.toPage("/pages/my/detail/main")
          }else {
            this.isModel = !this.isModel;
          }
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .home{
    /*height: 100vh;*/
    width: 100vw;
    background-color: rgba(245, 245, 245, 0.58);
    padding: 10rpx 20rpx;
    box-sizing: border-box;
    .header{
      background-color: #FFFFFF;
      border-radius: 10rpx;
      width: 710rpx;
      height: 332rpx;
      ul{
        display: flex;
        flex-direction: column;
      }
      ul li{
        display: flex;
        align-items: center;
        padding: 0rpx 25rpx;
        height: 110rpx;
        p{
          width: 120rpx;
          font-size: 30rpx;
          color: #303030;
          font-weight: bold;
        }
        >span{
          color: #BBCBE7;
          margin: 0 20rpx;
        }
        >input{
          flex: 1;
        }
        >button{
          width: 160rpx;
          height: 70rpx;
          border-radius: 35rpx;
          background-color: #86AAE5;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .remind{
      color: #EF5B5C;
      margin-top: 20rpx;
      font-size: 24rpx;
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

    .modalMask {
      width: 100%;
      height: 100%;
      position: fixed;
      display: flex;
      top: 0;
      left: 0;
      background: rgba(0,0,0,0.5);
      overflow: hidden;
      z-index: 9000;
      color: #fff;
    }
    .modalDialog {
      box-sizing: border-box;
      width: 560rpx;
      overflow: hidden;
      margin: auto;
      background: #fff;
      border-radius: 8rpx;
      .remind{
        text-align: center;
      }
    }
    .modalContent {
      box-sizing: border-box;
      display: flex;
      padding: 50rpx 53rpx;
      font-size: 32rpx;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      >input{
        flex: 1;
        height: 84rpx;
        background-color: #DFDFDF;
        padding-left: 15rpx;
      }
    }
    .title{
      font-size: 30rpx;
      text-align: center;
      color: #121214;
      margin-bottom: 5rpx;
    }
    .remind{
      color: #EF5B5C;
      margin-top: 20rpx;
      font-size: 28rpx;
    }
    .teleStyle {
      background: #ffffff;
      border: 1px solid #979797;
      border-radius: 6rpx;
      line-height: 50rpx;
      height: 50rpx;
      box-sizing: border-box;
      padding-left: 12rpx;
      width: 460rpx;
      font-size: 28rpx;
      /*color: rgba(0,0,0,0.25);*/
      margin-top: 30px;
    }
    .modalFooter {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      height: 100rpx;
      border-top: 1px solid #e5e5e5;
      font-size: 32rpx;
      line-height: 100rpx;
    }
    .btnCancel {
      width: 50%;
      font-size: 32rpx;
      color: #333;
      text-align: center;
      border-right: 1px solid #e5e5e5;
    }
    .btnConfirm {
      font-size: 32rpx;
      width: 50%;
      color: #508cee;
      text-align: center;
    }
    /* 弹窗结束 */


  }

</style>
