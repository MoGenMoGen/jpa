<template>
  <div class="home">
    <!--广告图-->
    <div class="header">
      <img :src="srcUrl"/>
    </div>
    <!--导航栏-->
    <div class="nav">
      <ul>
        <li v-for="(item,index) in navList" :key="index" @click="cd = item.cd">
          <p :class="{red:item.cd ==cd}">{{item.nm}}<span>({{item.num}})</span></p>
        </li>
      </ul>
    </div>
    <div class="line"></div>
    <!--内容-->
    <div class="content">
      <div class="list" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
        <p>{{item.taskTitle}}</p>
        <p>{{item.code}}</p>
        <p>
          <img v-if="item.status == 0 && cd==1" src="../../../../static/task/preservation.png">
          <img v-if="item.status == 10 && cd==1" src="../../../../static/task/approval.png">
          <img v-if="item.status == 30 && cd==1" src="../../../../static/task/failed.png">
          <img v-if="cd == 2" src="../../../../static/task/countdown.png">
          <img v-if="cd == 3" src="../../../../static/task/revoke.png">
          {{item.statusNm}}
        </p>
        <img v-if="item.taskPlat == '微信'" class="from" :src="wechat"/>
        <img v-if="item.taskPlat == '抖音'" class="from" :src="tiktok"/>
      </div>
    </div>
    <div class="publish" @click="toPage('/pages/task/new/main')">
      <p>发布</p>
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
          nm:'发布中',
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
        pageNo:1,
        pageSize:10,
        total:0,
      }
    },
    watch:{
      cd(){
        this.list=[]
        this.pageNo=1
        this.total=0
        this.getList(this.cd)
      },
    },
    onReachBottom(){
        console.log('下滑')
        if(this.list.length>=this.total){
          return
        }
        if(this.list.length<this.total){
          this.pageNo++
          this.getList(this.cd)
        }

      },
    onShareAppMessage (res) {
      return {
        title: '发布任务列表页',
        desc: "发布任务列表页",
        path: '/pages/task/publish/main'
      }
    },
    onShow(){
      this.list=[],
      this.getData();
      this.getTotal()
      this.getList(this.cd)
    },
    methods:{
      async getTotal(){
        console.log('获取总数————————————')
        let data=await this.api.pubTaskTotal()
        console.log(data)
        //发布中总数
        this.navList[0].num=data.publishCount
        //发布完成总数
        this.navList[1].num=data.finishCount
        //已撤销总数
        this.navList[2].num=data.cancelCount
      },
      async getList(cd){
        let qry = this.query.new()
        this.query.toO(qry,'crtTm','desc')
        this.query.toP(qry,this.pageNo,this.pageSize)
        let data
        if(cd==1){//发布中
          data=await this.api.publishing(this.query.toEncode(qry))
          this.navList[0].num=data.page.total
          console.log('发布中')
        }else if(cd==2){
          this.query.toW(qry,'status','20','EQ')
          data=await this.api.publishTask(this.query.toEncode(qry))
          this.navList[1].num=data.page.total
          console.log('发布完成')
        }else if(cd==3){
          this.query.toW(qry,'status','40','EQ')
          data=await this.api.publishTask(this.query.toEncode(qry))
          this.navList[2].num=data.page.total
          console.log('已撤销')
        }
        if (data.data.list.length != 0) {
          data.data.list.forEach(item=>{
            if(item.status==0){
              item.statusNm='已保存'
            }else if(item.status==10){
              item.statusNm='待审批'
            }else if(item.status==20){
              item.statusNm='发布完成'
            }else if(item.status==30){
              item.statusNm='审批未通过'
            }else if(item.status==40){
              item.statusNm='发布撤销 '
            }

            this.list.push(item)
          })

        }else{

        }
        this.total=data.page.total

      },
      toDetail(item){

        if(item.status==0||item.status==30){
          this.until.aHref('/pages/task/new/main?id='+item.id)

        }else{
          this.until.aHref('/pages/task/pubDetail/main?id='+item.id+'&cd='+this.cd)
        }

      },
      toPage(url){
        this.until.aHref(url)
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
    height: 100vh;
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
        padding-bottom: 32rpx;
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
      background-image: url("https://sinovat.oss-cn-shanghai.aliyuncs.com/c2dbd6e74206449ebfa3cf906bb94a45_release.png");
      background-size: 100% 100%;
      p{
        line-height: 90rpx;
        height: 90rpx;
        font-size: 24rpx;
        color: #FFFFFF;
        font-weight: bold;
        /*text-decoration: underline;*/
        text-align: center;
      }
    }
  }

</style>
