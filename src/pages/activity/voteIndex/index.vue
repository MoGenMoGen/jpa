<template>
  <div id="home">
    <div class="header">
      <div v-for="(item,index) in headList" :key="index">
        <p>{{item.nm}}</p>
        <span>{{item.cd}}</span>
      </div>
      <p>距活动结束时间：<span>{{endTime.day}}</span>天<span>{{endTime.h}}</span>时<span>{{endTime.m}}</span>分<span>{{endTime.s}}</span>秒</p>
    </div>
    <div class="center">
      <p class="title"><span></span>总排行榜</p>
      <div class="cont">
        <div v-for="(item,index) in rankingList" :key="index">
          <p><img v-if="index==0" src="../../../../static/activity/1.png"/><img v-if="index==1" src="../../../../static/activity/2.png"/><img v-if="index==2" src="../../../../static/activity/3.png"/>{{item.nm}}</p>
          <p>{{item.votes}}</p>
        </div>
      </div>
      <p @click="toPage('/pages/activity/voteRanking/main?id='+ id)">查看更多 ></p>
    </div>
    <div class="nav">
      <p v-for="(item,index) in navList" :key="index" @click="toPage('/pages/activity/vote/main?id='+ item.id + '&nm=' + item.nm + '&maxNum=' + item.maxNum + '&minNum=' + item.minNum+ '&actId=' + item.actId+'&city='+city + '&cityCd='+cityCd)">{{item.nm}}</p>
    </div>
    <div class="content" v-for="(item,index) in navList" :key="index">
      <div class="title">
        <p><span></span>{{item.nm}}</p><p @click="toPage('/pages/activity/vote/main?id='+ item.id + '&nm=' + item.nm + '&maxNum=' + item.maxNum + '&minNum=' + item.minNum+ '&actId=' + item.actId+'&city='+city + '&cityCd='+cityCd)">查看更多 ></p>
      </div>
      <div class="list">
        <div v-for="(v,i) in list" :key="i" v-if="v.groupId == item.id" @click="toPage('/pages/activity/vote/main?id='+ v.groupId + '&nm=' + v.groupNm + '&maxNum=' + item.maxNum + '&minNum=' +item.minNum+ '&actId=' + v.actId +'&city='+city + '&cityCd='+cityCd)">
          <div class="imgDiv">
            <img :src="v.imgUrl"/>
            <span>{{v.cd}}</span>
          </div>
          <p style="margin-bottom: 17rpx;">{{v.nm}}</p>
          <span style="margin-bottom: 22rpx;">{{v.votes}}票</span>
        </div>
      </div>
    </div>

    <!--弹窗三-->
    <div class="modalMask3" v-if="isModel3"></div>
    <div class="modalDialog3" v-if="changeModel3">
      <div class="modalContent3" >
        <p class="header1">市区选择</p>
        <div class="cont">
          <picker  :range="addrList" :range-key="'nm'" :value="index2"  @change="bindPickerChange" style="width: 100%;">
            <p class="select" style="width: 100%;font-weight: normal;padding-left: 25rpx;"><span>{{city ? city : '请选择 市 / 区'}}</span><img style="float:right;width:18rpx;height: 10rpx;padding-right: 22rpx;" src="../../../../static/my/dropdown.png"/></p>
          </picker>
        </div>
        <div class="foot">
          <p @click="close3()">取消</p>
          <p @click="toConfirm()">确认</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        headList:[{
          nm:'候选人',
          cd:'1'
        },{
          nm:'总投票数',
          cd:'1'
        }],
        rankingList:[{
          nm:'李艳',
          cd:'20票'
        },{
          nm:'小红',
          cd:'10票'
        },{
          nm:'小明',
          cd:'5票'
        }],
        navList:[],
        list:[],
        list2:[],
        id:'',//投票详情id
        pageNo:1,
        pageSize:3,
        info:'',
        total:'',
        status:-1, //0未开始 1已开始 2已结束
        startTime:{},
        endTime:{
          day:'',
          hour:'',
          min:'',
          second:'',
        },
        timer:'',//页面关闭时销毁
        changeModel3: false,
        isModel3:false,
        addrList:[],
        index2:0,
        city:'',
        cityCd:'',
      };
    },
    components:{
    },
    onLoad(options){
      this.id = options.id
      this.getAddr();
      this.getData();
      this.getGroupList();
      this.getWaitList();
      this.getWaitInfo();
      this.getVoteRanking();
      //每隔一秒钟刷新一次页面
      this.timer = setInterval(()=>{
        this.endTime = this.overDown(this.info.actToTm);
      },1000)

    },
    onUnload(){
      clearInterval(this.timer);
    },
    onHide(){
      clearInterval(this.timer);
    },
    async onShow(){

    },
    watch:{

    },
    methods: {
      toPage(url){
        this.until.aHref(url)
      },
      //获取是否有地址
      async getAddr(){
        let data = await this.api.getAddr(this.id)
        this.addr = data.data
        if(this.addr.addrExisted != true){
          this.isModel3 = true;
          this.changeModel3 = true;
          this.getAddrList();
        }else{
          this.city = this.addr.addrNm
          this.cityCd = this.addr.addrCd
        }
      },
      async getData(){
        let data = await this.api.getVoteDetail(this.id)
        this.info = data.data;
        this.endTime = this.overDown(this.info.actToTm);
      },
      //获取结束时间
      overDown(count){
        let start = new Date(count.replace(/-/g, '/'));
        let end = new Date();
        //Date类型的valueOf(),返回当前日期毫秒数,可以直接比较
        if(start<end){
          return {day:0,h:'00',m:'00',s:'00'}
        }
        let total = (start.getTime() - end)/1000;
        let day = Math.floor(total/(60*60)/24)
        let h = parseInt(total/(60*60)%24);
        let m = parseInt(total/60%60);
        let s = parseInt(total%60);
        h = h<10?"0"+h:h;
        m = m<10?"0"+m:m;
        s = s<10?"0"+s:s;
        return {day,h,m,s};
      },
      //获取候选人分组列表
      async getGroupList(){
        let qry = this.query.new();
        this.query.toW(qry, 'actId', this.id,'EQ');
        let data =await this.api.getGroupList(encodeURIComponent(this.query.toJsonStr(qry)))
        this.navList = data.data.list
      },
      //获取候选人列表
      async getWaitList(){
        let qry = this.query.new();
        this.query.toW(qry, 'actId', this.id,'EQ');
        let data =await this.api.getWaitList(encodeURIComponent(this.query.toJsonStr(qry)))
        this.list = data.data.list
      },
      //获取候选人人数
      async getWaitInfo(){
        let data = await this.api.getWaitInfo(this.id)
        this.headList[0].cd = data.data.waiters
        this.headList[1].cd = data.data.totalVotes
      },
      //获取排行榜
      async getVoteRanking(){
        let qry = this.query.new();
        this.query.toW(qry, 'actId', this.id,'eq');
        this.query.toO(qry, 'votes', 'desc');
        this.query.toP(qry, this.pageNo, this.pageSize);
        let data = await this.api.getVoteRanking(encodeURIComponent(this.query.toJsonStr(qry)))
        this.rankingList = data.data.list
        this.total = data.page.total
      },
      async getAddrList(){
        let qry = this.query.new();
        this.query.toO(qry, "sort", "asc");
        let data = await this.api.getNewsCity(encodeURIComponent(this.query.toJsonStr(qry)))
        this.addrList = data
        console.log(this.addrList)
      },
      //地址更改
      bindPickerChange(e){
        this.index2 = e.mp.detail.value
        this.city = this.addrList[this.index2].nm
        this.cityCd = this.addrList[this.index2].addrCd
        // this.$set(this.info,'sex',this.info.sex)
      },
      //弹窗三关闭
      close3(){
        this.changeModel3 = !this.changeModel3;
        this.isModel3 = !this.isModel3;
      },
      //弹窗三确认
      toConfirm(){
        this.close3();
        console.log('city',this.city)
      },
    },
  }
</script>
<style lang="less" scoped>
  #home{
    height: 100%;
    width: 100vw;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    font-size: 16px;
    padding: 30rpx;
    background-color: #F4F4F4;
    box-sizing: border-box;
    .header{
      width: 100%;
      background-color: #FFFFFF;
      height: 245rpx;
      border-radius: 10rpx;
      display: flex;
      flex-wrap: wrap;
      >div{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50%;
        >p{
          font-size: 30rpx;
          color: #666666;
        }
        >span{
          font-size: 30rpx;
          color: #E22829;
          margin-top: 28rpx;
        }
      }
      >p{
        font-size: 24rpx;
        color: #666666;
        width: 100%;
        border-top: 1rpx solid rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        >span{
          color: #E22829;
          margin-left: 29rpx;
        }
      }
    }
    .center{
      height: 467rpx;
      background-color: #FFFFFF;
      border-radius: 10rpx;
      margin-top: 30rpx;
      display: flex;
      flex-direction: column;
      .title{
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        padding-left: 37rpx;
        height: 92rpx;
        border-bottom: 1rpx solid #E0E0E0;
        >span{
          display: inline-block;
          margin-right: 10rpx;
          width: 4rpx;
          height: 32rpx;
          background: #E22829;
        }
      }
      .cont{
        display: flex;
        flex-direction: column;
        >div{
          display: flex;
          align-items: center;
          padding: 0 56rpx 0 31rpx;
          height: 103rpx;
          border-bottom: 1rpx solid #E0E0E0;
          >p:nth-child(1){
            flex: 1;
            font-size: 30rpx;
            color: #333333;
            display: flex;
            align-items: center;
            >img{
              width: 39rpx;
              height: 53rpx;
              margin-right: 28rpx;
            }
          }
          >p:nth-child(2){
            font-size: 26rpx;
            color: #E22829;
            display: flex;
            align-items: center;
          }
        }
      }
      >p:last-child{
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
        color: #0F64FF;
        font-size: 24rpx;
        height: 63rpx;
      }
    }
    .nav{
      display: flex;
      height: 109rpx;
      align-items: center;
      border-bottom: 1rpx solid #E0E0E0;
      >p{
        width: 171rpx;
        height: 49rpx;
        font-size: 30rpx;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 30rpx;
        background-color: #FFFFFF;
        border-radius: 40rpx;
      }
    }
    .content{
      .title{
        display: flex;
        align-items: center;
        height: 91rpx;
        >p:nth-child(1){
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          flex: 1;
          >span{
            display: inline-block;
            margin-right: 20rpx;
            width: 4rpx;
            height: 32rpx;
            background: #E22829;
          }
        }
        >p:nth-child(2){
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          font-size: 24rpx;
          color: #999999;
        }
      }
      .list{
        flex: 1;
        width: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        margin: 20rpx auto;
        border-bottom: 1rpx solid #E0E0E0;
        >div{
          float: left;
          text-align: center;
          margin-right: 3.5%;
          margin-top: 20rpx;
          padding-bottom: 30rpx;
          /*border-bottom: 1px solid #E0E0E0;*/
          &:nth-of-type(2n){
            margin-right: 0;
          }
          .imgDiv{
            position: relative;
            display: flex;
            display: -webkit-flex;
            margin-bottom: 10rpx;
            /*background-repeat: no-repeat;*/
            /*background-position: center top;*/
            /*background-size: 100%;*/
            >img{
              width: 330rpx;
              height: 400rpx;
            }
            >span{
              position: absolute;
              top:-8rpx;
              padding-top: 8rpx;
              font-size: 24rpx;
              left: 10rpx;
              width: 50rpx;
              height: 56rpx;
              background: url("http://jiapingan.oss-cn-hangzhou.aliyuncs.com/082249d70d7d48a8b7a3a770f0131def.png") no-repeat;
              background-size: contain;
              text-align: center;
              color: #ffffff;
            }
          }
          >p{
            font-size: 30rpx;
          }
          >span{
            display: block;
            font-size: 30rpx;
            &:first-of-type{
              color: #FF3000;
            }
          }
        }
      }
    }

    //弹窗3
    .modalMask3 {
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
    .modalDialog3 {
      box-sizing: border-box;
      width: 560rpx;
      overflow: hidden;
      position: fixed;
      top: 40%;
      left: 0;
      z-index: 9999;
      background: #fff;
      margin: -180rpx 95rpx;
      border-radius: 8rpx;
    }
    .modalContent3 {
      box-sizing: border-box;
      display: flex;
      padding: 50rpx 53rpx;
      font-size: 32rpx;
      /*align-items: center;*/
      /*justify-content: center;*/
      flex-direction: column;
      .header1{
        font-size: 30rpx;
        color: #333333;
        width: 100%;
        text-align: center;
        margin-bottom: 47rpx;
      }
      .cont{
        height: 65rpx;
        display: flex;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        /*margin-bottom: 84rpx;*/
        .select{
          border: 1rpx solid #CCCCCC;
          box-sizing: border-box;
          height: 65rpx;
          width: 100%;
          display: flex;
          align-items: center;
          color: #999999;
          font-size: 24rpx;
          >span{
            flex: 1;
          }
        }
      }
      .foot{
        margin-top: 84rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        >p:nth-child(1){
          width: 199rpx;
          height: 63rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 30rpx;
          background-color: #BABABA;
          border-radius: 31rpx;
        }
        >p:nth-child(2){
          width: 199rpx;
          height: 63rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 30rpx;
          background-color: #F32730;
          border-radius: 31rpx;
        }
      }
    }

  }

</style>
