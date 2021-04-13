<template>
<div class="home">
  <div class="header">
    <ul>
      <li>
        <p>真实姓名</p>
        <span>|</span>
        <input type="text" v-model="info.realNm" disabled/>
      </li>
      <li>
        <p>目前单位</p>
        <span>|</span>
        <input type="text" placeholder="暂无（指本人已加入的单位）" v-model="info.unit" disabled/>
      </li>
      <li>
        <p>所在省市</p>
        <span>|</span>
        <addr-select v-show="addrShow" @changeAddr="changeAddr" ref="addr" ></addr-select>
      </li>
      <li>
        <p>所在区域</p>
        <span>|</span>
        <picker range-key="nm" @change="changeZone" :value="zoneIndex" :range="zoneList">
          <view class="picker">
            {{zone?zone:'选择区域'}}
          </view>
        </picker>
      </li>
      <li>
        <p>待绑单位</p>
        <span>|</span>
        <input type="text" placeholder="暂无（指本人已加入的单位）" v-model="info.nextUnit"/>
      </li>
    </ul>
  </div>
  <!--搜索-->
  <div class="search">
    <input placeholder="请输入待绑定单位的关键字搜索" v-model="search" @input="getUnit"/>
  </div>
  <!--地区单位列表-->
  <div class="company">
    <ul>
      <li v-for="item in unitList" :key="item.id" @click="toChoose(item)">
        {{item.unit}}
      </li>
    </ul>
  </div>

  <div class="foot">
    <!--<button>提交</button>-->
  </div>

  <div class="modalMask" v-if="isModel"></div>
  <div class="modalDialog" v-if="changeModel">
    <div class="modalContent">
      <p class="title">修改职务名称</p>
      <input placeholder="请输入职务名称" v-model="info.nm"/>
    </div>
    <div class="modalFooter">
      <div class="btnCancel" @tap="tapCancel">取消</div>
      <div class="btnConfirm" @tap="confirmSend">确定</div>
    </div>
  </div>

</div>
</template>

<script>
  import addrSelect from '@/components/addrSelect'
  export default {
    data(){
      return{
        info:{
          nm:'张三',
          nm2:'主任',
          nm3:'党员',
          nm4:'',
          nm5:'',
        },
        zone:'',
        zoneIndex:0,
        form:{
          addrNm:'',
          addrCd:'',
        },
        unitList:[],
        search:'',
        type:0,
        changeModel: false,
        isModel: false,
        addrCd:'',
        zoneList:[],
      }
    },
    components:{
      addrSelect
    },
    async onShow(){
      this.isModel = false
      this.info.id = wx.getStorageSync("userInfo").id
      this.getInfo()
      this.getUnit()
    },
    onShareAppMessage (res) {
      return {
        title: '绑定单位',
        desc: "单位绑定页",
        path: '/pages/my/detail/main'
      }
    },
    methods:{
      changeZone(e){
        this.zoneIndex = e.mp.detail.value
        this.zone = this.zoneList[this.zoneIndex].nm
        this.form.addrCd = this.form.addrCd +'-'+this.zoneList[this.zoneIndex].id
        this.getUnit()
      },
      setAddr(){
        this.$refs.addr.setAddr(this.form.addrNm)
      },
      async getAddrZone(cd){
        let qry = this.query.new();
        this.query.toW(qry, "pid",cd, "EQ");
        this.query.toW(qry, "status",0, "EQ");
        this.zoneList = await this.api.getCity(encodeURIComponent(this.query.toJsonStr(qry)))
      },
      //地区更改
      changeAddr(addr){
        this.form.addrNm = addr.nm
        this.form.addrCd = addr.code
        this.zone = ''
        this.getAddrZone(addr.code.split('-')[1])
        this.getUnit()
      },
      async getInfo(){
        console.log('=======22')

        this.info = await this.api.myCompanyDetail(this.info.id)
        console.log('22222222')
      },
      toPage(url){
        this.until.aHref(url)
      },
      //选择
      toChoose(item){
        let that = this
        wx.showModal({
          title: '提示',
          content: `是否绑定“${item.unit}”？`,
          success (res) {
            if (res.confirm) {
              let param = {
                "id": that.info.id,
                "nextUnit": item.unit,
                "nextUnitAddrCd": item.unitAddrCd,
                "nextUnitAddrNm": item.unitAddrNm,
                "nextUnitId": item.id
              }
              that.api.unitBind(param).then(res=>{
                wx.showModal({
                  title:'提示',
                  content:'单位信息提交成功！我们会在七个工作日内进行审核：请耐心等待！',
                  showCancel:false,
                  confirmColor:'#86AAE5'
                })
                that.api.myCompany()
                setTimeout(()=>{
                  // wx.switchTab({url:'/pages/my/index/main'})
                  wx.reLaunch({url:'/pages/my/index/main'})
                },1500)
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      //绑定
      toBind(){

      },
      //获取单位列表
      async getUnit(){
        let qry = this.query.new()
        this.query.toW(qry,'unitAddrCd',this.form.addrCd,'LK')
        this.query.toW(qry,'unit',this.search,'LK')
        this.unitList = await this.api.unitList(this.query.toEncode(qry))
      },
      tapCancel() {
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      },
      //  确认
      confirmSend() {
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      },
      //打开弹窗
      show_pro(type) {
            this.changeModel = !this.changeModel;
            this.isModel = !this.isModel;
      }
    }
  }
</script>
<style scoped lang="less">
  .home{
     /*width: 100vw;*/
    background-color: rgba(245, 245, 245, 0.58);
    padding: 10rpx 20rpx;
    box-sizing: border-box;
    .header{
      background-color: #FFFFFF;
      border-radius: 10rpx;
      width: 710rpx;
      height: 554rpx;
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
          flex-shrink: 0;
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

    .search{
      margin-top: 21rpx;
      margin-bottom: 21rpx;
      width: 710rpx;
      height: 80rpx;
      >input{
        width: 100%;
        height: 100%;
        text-align: center;
        background-color: #FFFFFF;
        border-radius: 10rpx;
      }
    }
    //列表
    .company{
      background-color: #FFFFFF;
      width: 100%;
      padding: 20rpx 0;
      li{
        padding: 0 25rpx;
        line-height: 70rpx;
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
      background: #000;
      opacity: 0.5;
      overflow: hidden;
      z-index: 9000;
      color: #fff;
    }
    .modalDialog {
      box-sizing: border-box;
      width: 560rpx;
      overflow: hidden;
      position: fixed;
      top: 50%;
      left: 0;
      z-index: 9999;
      background: #fff;
      margin: -180rpx 95rpx;
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
