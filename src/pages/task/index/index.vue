<template>
  <div class="home">
    <div class="main">
      <!--广告图-->
      <div class="header">
        <img :src="srcUrl"/>
      </div>
      <!--导航栏-->
      <div class="nav">
        <ul>
          <li v-for="(item,index) in navList" :key="index" @click="tabChange(item.cd)">
            <p :class="{red:item.cd ==cd}">{{item.nm}}<span>({{item.num}})</span></p>
          </li>
        </ul>
      </div>
      <div class="line"></div>
      <!--内容-->
      <div class="content">
        <div class="list" v-for="(item,index) in list" :key="index" @click="toPage('/pages/task/detail/main?cd='+cd +'&id='+ item.id)">
          <p>{{item.taskTitle}}</p>
          <p>{{item.code}}</p>
          <p :class="{gray : cd==2}"><img v-if="cd == 1" src="../../../../static/task/countdown.png"><img v-if="cd == 2" src="../../../../static/task/complete.png"><img v-if="cd == 3" src="../../../../static/task/complete2.png">{{item.endTime}}</p>
          <img v-if="item.taskPlat == '微信'" class="from" :src="wechat"/>
          <img v-if="item.taskPlat == '抖音'" class="from" :src="tiktok"/>
        </div>
      </div>
    </div>
    <tab123 :tabCd="tabCd"></tab123>
  </div>
</template>

<script>
  import wechat from '../../../../static/task/wechat.png'
  import tiktok from '../../../../static/task/tiktok.png'
  import tab123 from "../../../components/tabNew.vue";

  export default {
    data(){
      return{
        wechat,
        tiktok,
        pageNo:1,
        pageSize:10,
        total:0,
        srcUrl:'',
        navList:[{
          nm:'新任务',
          num:0,
          cd:1
        },{
          nm:'已完成',
          num:0,
          cd:2
        },{
          nm:'已超时',
          num:0,
          cd:3
        }],
        cd:1,
        //任务列表        //from:1 wechat ; from:2 tiktok
        list:[{
          nm:'平安建设',
          pr:'嘉兴市委政法委-121-2020190926',
          tm:'剩 1 天 23 时 24 分',
          from: 1,
        },{
          nm:'平安建设',
          pr:'嘉兴市委政法委-121-2020190926',
          tm:'剩 1 天 23 时 24 分',
          from: 2,
        }],
        list1:[],//新任务
        list2:[],//已完成
        list3:[],//已超时
        timer:'',//页面关闭时销毁
        tabCd:'task',
      }
    },
    components: {
      tab123,
    },
    onReachBottom(){
      if(this.list.length>=this.total){
        console.log('下滑')
        return
      }
      if(this.list.length<this.total){
        this.pageNo++
        this.getList(this.cd)
      }

    },
    onShow(){
        if(!wx.getStorageSync('yui3-token')){
          wx.showModal({
            title: '提示',
            content: '您还没有登录，立即登录',
            success (res) {
              if (res.confirm) {
                wx.reLaunch({url:'/pages/login/index/main'})
              } else if (res.cancel) {
                wx.navigateBack()
              }
            }
          })
          return
        }
        if(!wx.getStorageSync('userInfo').unit){
          wx.showModal({
            title: '提示',
            content: '未绑定单位，请先绑定单位',
            success (res) {
              if (res.confirm) {
                // wx.switchTab({url:'/pages/my/index/main'})
                wx.reLaunch({url:'/pages/my/index/main'})
              } else if (res.cancel) {
                wx.navigateBack()
              }
            }
          })
        }else{
          this.getTotal();
          this.getData();
          this.tabChange(1);
          //每隔一分钟刷新一次页面
          this.timer = setInterval(()=>{
            this.getTime();
          },60000)
        }

    },
    onShareAppMessage (res) {
      return {
        title: "任务",
        desc: "任务",
        path: '/pages/task/index/main'
      }
    },
    onUnload(){
      clearInterval(this.timer);
    },
    onHide(){
      clearInterval(this.timer);
    },
    onPullDownRefresh () {
      // 初始化页码
      this.pageNo = 1
      this.list=[]
      this.getList()
    },
    methods:{
      async getTotal(){
        let data = await this.api.finishCount()
        this.navList[0].num = data.newCount
        this.navList[1].num = data.finishCount
        this.navList[2].num = data.outTmCount
      },
      getTime(){
        if(this.cd==2){
          return
        }
        if(this.cd==1){
          this.list.forEach(item=>{
            let time = this.until.CountDown(item.endTm)
            let d = Number(time.day);
            let h = Number(time.h);
            let m = Number(time.m);
            let endTime = '剩 '+ d+' 天 '+ h + ' 时 '+ m + ' 分'
            this.$set(item,'endTime',endTime)
          })

        }
        if(this.cd==3){
          this.list.forEach(item=>{
            let time = this.overDown(item.endTm)
            let d = Number(time.day);
            let h = Number(time.h);
            let m = Number(time.m);
            let endTime = '超时'+ d+'天'+ h + '时'+ m + '分'
            this.$set(item,'endTime',endTime)
          })
        }
      },
      async getList(){
        let qry = this.query.new()
        this.query.toP(qry,this.pageNo,this.pageSize)
        this.query.toO(qry,'crtTm','desc')
        let data = null
        if(this.cd==1){
          data = await this.api.newTask(this.query.toEncode(qry))
          wx.stopPullDownRefresh()
          data.data.list.forEach(item=>{
            let time = this.until.CountDown(item.endTm)
            let d = Number(time.day);
            let h = Number(time.h);
            let m = Number(time.m);
            let endTime = '剩'+ d+' 天 '+ h + ' 时 '+ m + ' 分'
            this.$set(item,'endTime',endTime)
          })
          this.list.push(...data.data.list)

        }
        if(this.cd==2){
          data = await this.api.finishTask(this.query.toEncode(qry))
          wx.stopPullDownRefresh()
          data.data.list.forEach(item=>{
            this.$set(item,'endTime',item.finishTm)
          })
          this.list.push(...data.data.list)

        }
        if(this.cd==3){
          data = await this.api.overtimeTask(this.query.toEncode(qry))
          wx.stopPullDownRefresh()
          data.data.list.forEach(item=>{
            let time = this.overDown(item.endTm)
            let d = Number(time.day);
            let h = Number(time.h);
            let m = Number(time.m);
            let endTime = '超时'+ d+'天'+ h + '时'+ m + '分'
            this.$set(item,'endTime',endTime)
          })
          this.list.push(...data.data.list)

        }
      },
      //轮播图
      async getData(){
        let qry = this.query.new()
        this.query.toW(qry,'loc','banner')
        let data = await this.api.banner(this.query.toEncode(qry))
        this.srcUrl = data.data.list[0].srcUrl
      },
      tabChange(cd){
        this.cd = cd
        this.pageNo = 1
        this.list=[]
        this.getList()
        this.getTotal();
      },
      //每隔一分钟刷新一次页面
      toPage(url){
        this.until.aHref(url)
      },
      //超出时间
      overDown(count){
        let start = new Date(count.replace(/-/g, '/'));
        let end = new Date();
        //Date类型的valueOf(),返回当前日期毫秒数,可以直接比较
        if(start>end){
          return {day:0,h:'00',m:'00',s:'00'}
        }
        let total = (end - start.getTime())/1000;
        let day = Math.floor(total/(60*60)/24)
        let h = parseInt(total/(60*60)%24);
        let m = parseInt(total/60%60);
        let s = parseInt(total%60);
        h = h<10?"0"+h:h;
        m = m<10?"0"+m:m;
        s = s<10?"0"+s:s;
        return {day,h,m,s};
      }

    }
  }
</script>
<style scoped lang="less">
  .home{
    height: 100vh;
    width: 100vw;
    background-color: rgba(245, 245, 245, 0.58);
    display: flex;
    flex-direction: column;
    .main{
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .header{
      width: 100%;
      height: 350rpx;
      >img{
        width: 100%;
        height: 100%;
      }
    }
    .nav{
      ul{
        display: flex;
        background-color: #FFFFFF;
      }
      ul li{
        height: 110rpx;
        flex: 1;
        >p{
          text-align: center;
          line-height: 110rpx;
          font-size: 30rpx;
          color: #303030;
          font-weight: bold;
          >span{
            font-size: 18rpx;
            margin-left: 8rpx;
            color: #666666;
          }
        }
        .red{
          color: #E22829;
          >span{
            color: #E22829;
          }
        }
      }
    }
    .line{
      height: 10rpx;
      background-color: rgba(245, 245, 245, 0.58);
    }
    .content{
      width: 100%;
      background-color: #FFFFFF;
      /*margin-bottom: 145rpx;*/
      .list{
        padding-left: 61rpx;
        border-bottom: 1rpx solid #CCCCCC;
        padding-bottom: 30rpx;
        position: relative;
        .gray{
          color: #5F5F5F !important;
        }
        &:last-of-type{
          border-bottom: none;
        }
        p:nth-child(1){
          font-size: 32rpx;
          color: #303030;
          padding-top: 20rpx;
          font-weight: bold;
          width: 80%;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        p:nth-child(2){
          font-size: 24rpx;
          color: #606060;
          padding-top: 11rpx;
        }
        p:nth-child(3){
          font-size: 24rpx;
          color: #E22829;
          padding-top: 53rpx;
          display: flex;
          align-items: center;
        }
        p img{
          width: 26rpx;
          height: 26rpx;
          margin-right: 19rpx;
        }
        .from{
          position: absolute;
          width: 32rpx;
          height: 32rpx;
          right: 58rpx;
          top: 29rpx;
        }
      }
    }
  }

</style>
