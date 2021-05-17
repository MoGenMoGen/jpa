<template>
<div class="home">
  <div class="header">
    <ul>
      <li>
        <p>归属单位</p>
        <span>|</span>
        <input type="text" v-model="info.unit" disabled/>
        <!-- <button @click="toPage('/pages/my/detail/main')">修改</button> -->
        <p class="position" v-if="info.status==10">等待"{{info.nextUnit}}"管理员审核</p>
      </li>
      <li>
        <p>职务名称</p>
        <span>|</span>
        <input type="text" v-model="info.post" disabled/>
        <!-- <button @click="show_pro(0)">修改</button> -->
      </li>
      <li>
        <p>政治面貌</p>
        <span>|</span>
        <input type="text" v-model="info.politicsStatus" disabled/>
        <!-- <button @click="show_pro(1)">修改</button> -->
      </li>
    </ul>
  </div>

  <div class="modalMask" v-if="isModel">
    <div class="modalDialog">
      <div class="modalContent">
        <p class="title">修改职务名称</p>
        <input placeholder="请输入职务名称" v-model="info.post"/>
      </div>
      <div class="modalFooter">
        <div class="btnCancel" @tap="isModel=false">取消</div>
        <div class="btnConfirm" @tap="changeUpd">确定</div>
      </div>
    </div>
  </div>


  <div class="modalMask" v-if="isModel2">
    <div class="modalDialog">
      <div class="modalContent" style="height: 80vh">
        <p class="title">选择政治面貌</p>
        <radio-group @change="radioChange" class="radioGroup">
          <label class="weui-cell weui-check__label" v-for="item in ZZList"  :key="item.id">

            <view class="weui-cell__hd">
              <radio :value="item.cd"/>
            </view>
            <view class="weui-cell__bd">{{item.nm}}</view>
          </label>
        </radio-group>

      </div>
      <div class="modalFooter">
        <div class="btnCancel" @tap="isModel2 = false">取消</div>
        <div class="btnConfirm" @tap="changeUpd">确定</div>
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
          nm:'当前单位暂无',
          nm2:'主任',
          nm3:'党员'
        },
        type:0,
        isModel2: false,
        isModel: false,
        ZZList:[]
      }
    },
    async onShow(){
      this.isModel = false
      this.isModel2 = false
      this.info.id = wx.getStorageSync("userInfo").id
      this.getInfo()
      this.ZZList =  await this.api.getByCd('politics status')
    },
    onShareAppMessage (res) {
      return {
        title: "绑定单位",
        desc: "单位绑定",
        path: '/pages/my/position/main'
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
      // 确认
      changeUpd(){
        this.api.upd(this.info).then(()=>{
          this.isModel = false
          this.isModel2 = false
          this.getInfo()
        })
      },
      radioChange(e){
        let cd = e.mp.detail.value
        this.info.politicsStatus = cd
      },
      //打开弹窗
      show_pro(type) {
        if(type){
          this.isModel2 = true
        }else {
          this.isModel = true
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
    padding: 10rpx 20rpx;
    box-sizing: border-box;
    .header{
      background-color: #FFFFFF;
      border-radius: 10rpx;
      width: 710rpx;
      height: 372rpx;
      ul{
        display: flex;
        flex-direction: column;
      }
      ul li{
        display: flex;
        align-items: center;
        padding: 0rpx 25rpx;
        height: 124rpx;
        &:first-of-type{
          position: relative;
          .position{
            position: absolute;
            width: 429rpx;
            left: 25rpx;
            top: 100rpx;
            font-weight: normal;
          }
        }
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

    .modalMask {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(0,0,0,0.5);
      overflow: hidden;
      z-index: 9000;
      color: #fff;
      display: flex;
    }
    .modalDialog {
      box-sizing: border-box;
      width: 80%;
      background: #fff;
      margin: auto;
      border-radius: 8rpx;
    }
    .modalContent {
      box-sizing: border-box;
      display: flex;
      padding: 50rpx 53rpx;
      font-size: 32rpx;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 100%;
      .radioGroup{
        width: 100%;
        flex: 1;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        color: #343434;
        .weui-cell{
          width: 100%;
          display: flex;
          display: -webkit-flex;
          align-items: center;
          margin-top: 20rpx;
        }
      }
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
