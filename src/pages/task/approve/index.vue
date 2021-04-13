<template>
  <div class="home">
    <!--广告图-->
    <div class="header">
      <img :src="srcUrl"/>
    </div>
    <!--导航栏-->
    <div class="nav">
      <ul>
        <li v-for="(item,index) in navList" :key="index" >
          <p :class="{red:item.cd ==cd}" @click="changeCd(item.cd)">{{item.nm}}<span>({{item.num}})</span></p>
        </li>
      </ul>
    </div>
    <div class="line"></div>
    <!--内容-->
    <div class="content">
      <div class="list" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
        <p>{{item.taskTitle}}</p>
        <p>{{item.code}}</p>
        <p :class="{gray:cd==2}">
          <img v-if="cd==1" src="../../../../static/task/approval.png">
          <img v-if="cd == 2" src="../../../../static/task/complete.png">
          <img v-if="cd == 3" src="../../../../static/task/failed.png">
          {{item.endTm}}
        </p>
        <img v-if="item.taskPlat == '微信'" class="from" :src="wechat"/>
        <img v-if="item.taskPlat == '抖音'" class="from" :src="tiktok"/>
      </div>
    </div>
    <div class="publish">
<!--      <img src="../../../../static/task/release.png"/>-->
    </div>
  </div>
</template>

<script>
  import wechat from '../../../../static/task/wechat.png'
  import tiktok from '../../../../static/task/tiktok.png'
  export default {
    data(){
      return{
        wechat,
        tiktok,
        srcUrl:'',
        navList:[{
          nm:'待审批',
          num:2,//数量
          cd:1//高亮
        },{
          nm:'发布完成',
          num:2,
          cd:2
        },{
          nm:'发布撤销',
          num:1,
          cd:3
        }],
        cd:1,//当前选中高亮
        //任务列表        //from:1 wechat ; from:2 tiktok
        //status 状态 1：已保存 2：待审批 3：审批未通过
        list:[],
        timer:null,
        total:0,
      }
    },
    onPullDownRefresh () {
      // 初始化页码
      this.pageNo = 1
      this.list=[]
      this.getList()
    },
    onReachBottom () {

      if(this.list.length<this.total){
        console.log('开始加载')
        this.pageNo++
        this.getList()
      }
    },
    onLoad(){
      this.getData()

      // this.getList()
    },
    onShareAppMessage (res) {
      return {
        title: '任务审批',
        desc: "任务审批",
        path: '/pages/task/approve/main'
      }
    },
    onShow(){
      this.pageNo = 1
      this.list=[]
      this.getList()
      this.getTotal()

        // this.timer = setInterval(()=>{
      //   this.getTime()
      // },600000)
    },
    methods:{
      changeCd(cd){
        this.cd = cd
        console.log('---------')
        this.pageNo = 1
        this.list = []
        this.getList()
      },
      async getTotal(){
         let data = await this.api.SHTaskTotal()
        this.navList[0].num = data.auditCount
        this.navList[1].num = data.finishCount
        this.navList[2].num = data.cancelCount
      },
      toPage(url){
        this.until.aHref(url)
      },
      getTime(){
        if(this.list.length>0){
          this.list.forEach(item=>{
            let time = this.until.CountDown(item.endTm)
            let d = Number(time.day);
            let h = Number(time.h);
            let m = Number(time.m);
            let endTime = '剩'+ d+' 天 '+ h + ' 时 '+ m + ' 分'
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
          this.query.toW(qry,'status',10,'EQ')
        }
        if(this.cd==2){
          this.query.toW(qry,'status',20,'EQ')
        }
        if(this.cd==3){
          this.query.toW(qry,'status',40,'EQ')
        }
        data = await this.api.SHTask(this.query.toEncode(qry))
        wx.stopPullDownRefresh()
        this.list = data.data.list

        this.total = data.page.total
      },
      toDetail(item){
        if(this.cd == 1){
          this.toPage('/pages/task/examine/main?id='+item.id)
        }else if(this.cd==2) {
          this.toPage('/pages/task/detail/main?id='+item.id+'&cd=4')
        }else if(this.cd==3) {
          this.toPage('/pages/task/detail/main?id='+item.id+'&cd=5')
        }
      },
      async getData(){
        let qry = this.query.new()
        this.query.toW(qry,'loc','banner')
        let data = await this.api.banner(this.query.toEncode(qry))
        this.srcUrl = data.data.list[0].srcUrl
      },
    }
  }
</script>
<style scoped lang="less">
  .home{
    height: 100%;
    width: 100vw;
    background-color: rgba(245, 245, 245, 0.58);
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
      .list{
        padding-left: 61rpx;
        border-bottom: 1rpx solid #CCCCCC;
        padding-bottom: 30rpx;
        position: relative;
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
          padding-top: 48rpx;
          display: flex;
          align-items: center;
        }
        .gray{
          color: #606060 !important;
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
    .publish{
        width: 90rpx;
        height: 90rpx;
        position: fixed;
        bottom:88rpx;
        right: 30rpx;
    }
  }

</style>
