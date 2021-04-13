<template>
<div class="home">
  <div class="header">
    <p><img src="../../../../static/my/integral2.png">本年度总学分100</p>
    <div class="center">
      <p>已获得学分</p>
      <p>{{number}}</p>
      <p class="rightBottom">完成率：{{completionRate}}%</p>
    </div>
  </div>
  <div class="title">
    <p><img src="../../../../static/my/横线.png"><span>积分明细</span><img src="../../../../static/my/横线.png"></p>
  </div>
  <div class="content">
    <div class="nav">
      <p @click="changeActive(item)" v-for="item in navList" :key="item.cd" :class="{active:cd == item.cd}">
        {{item.nm}}
        <img v-if="item.cd == cd" src="../../../../static/my/底部横线.png">
      </p>
    </div>
    <div class="list">
      <ul>
        <li v-for="(item,index) in list" :key="index">
          <div class="left">
            <p>{{item.rmks}}</p>
            <p>{{item.times}}</p>
          </div>
          <div class="right">
            <span>积分</span>
            <span>+{{item.score}}</span>
          </div>
        </li>
      </ul>
      <p v-if="list.length<1">暂无积分</p>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    data(){
      return{
        number: 0,
        list:[],
        pageNo:1,
        pageSize:10,
        total:0,
        cd:'1',//此时选中项
        completionRate:'',//完成率
        navList:[{
          nm:'新闻资讯',
          cd:'1',
        },{
          nm:'互动活动',
          cd:'2',
        },{
          nm:'学习考试',
          cd:'3',
        }],
      }
    },
    async onShow(){
      this.pageNo=1,
        this.list=[]
      // this.getNum();
      this.getData();
      this.getScore();
    },
    onShareAppMessage (res) {
      return {
        title: '学习积分',
        desc: "学习积分页",
        path: '/pages/my/integral/main'
      }
    },
    onReachBottom(){
      console.log('上拉')
      if(this.list.length>=this.total){
        return
      }
      if(this.list.length<this.total){
        this.pageNo++
        this.getData()
      }
    },
    methods:{
      //跳转至登录页面
      toPage(url) {
        wx.reLaunch({url})
      },
      async getNum(){
        let data =await this.api.myCompany()
        console.log(data)
        this.number = data.data.score
      },
      async getScore(){
        let data =await this.api.getyearScore()
        this.number = data.score
        this.completionRate = data.completionRate
        console.log(data)
      },
      changeActive(item){
        this.cd = item.cd
        this.pageNo = 1;
        this.list=[];
        this.getData();
      },
      async getData(){
        let qry = this.query.new();
        this.query.toO(qry, "crtTm", "desc");
        this.query.toW(qry,"type",this.cd,'EQ')
        this.query.toP(qry, this.pageNo, this.pageSize);
        let data = await this.api.getIntegral(encodeURIComponent(this.query.toJsonStr(qry)))
        this.list.push(...data.data.list)
        this.total=data.page.total
        this.list.forEach(item=>{
          let times =item.crtTm.substr(0,10);
          this.$set(item,'times',times)
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .home{
    min-height: 100vh;
    width: 100vw;
    background-color: rgba(242, 242, 242, 0.58);
    .header{
      margin: 17rpx 20rpx;
      background-image: url("http://oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/pfyf/12a5979ead3e41a8a9672e2b93a3fba3.png");
      background-size: 100% 100%;
      width: 710rpx;
      height: 280rpx;
      position: relative;
      >p{
        position: absolute;
        top: 42rpx;
        left: 18rpx;
        display: flex;
        align-items: center;
        color: #FFFFFF;
        font-size: 24rpx;
        >img{
          width: 24rpx;
          height: 24rpx;
          margin-right: 2rpx;
        }
      }
      .center{
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        justify-content: center;
        flex-wrap: wrap;
        position: relative;
        p:nth-child(1){
          font-size: 24rpx;
          color: #FFFFFF;
          width: 100%;
          text-align: center;
          padding-top: 94rpx;
        }
        p:nth-child(2){
          font-size: 60rpx;
          color: #FFFFFF;
          width: 100%;
          text-align: center;
          padding-bottom: 70rpx;
        }
        .rightBottom{
          position: absolute;
          right: 31rpx;
          bottom: 30rpx;
          font-size: 24rpx;
          color: #FFFFFF;
        }
      }
    }
    .title{
      height: 108rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 34rpx;
      color: #303030;
      margin-bottom: 20rpx;
      p{
        display: flex;
        align-items: center;
        >span{
          margin: 0 44rpx;
        }
      }
      p img{
        width: 79rpx;
        height: 1rpx;
      }
    }
    .content{
      /*height: 1129rpx;*/
      margin: 17rpx 20rpx;
      width: 710rpx;
      border-radius: 30rpx;
      background-color: #FFFFFF;
      .nav{
        display: flex;
        align-items: center;
        height: 83rpx;
        border-bottom: 2rpx solid #F7F7F7;
        >p{
          width: 33.3%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30rpx;
          color: #606060;
          height: 100%;
          position: relative;
          >img{
            width: 140rpx;
            height: 3rpx;
            position: absolute;
            bottom: 0;
          }
        }
        .active{
          font-size: 30rpx;
          color: #E22829;
        }
      }
      .list{
        padding: 23rpx 30rpx 30rpx 30rpx;
        ul li{
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100rpx;
          /*line-height: 68rpx;*/
          border-bottom: 1rpx solid #F7F7F7;
          &:last-of-type{
            border-bottom: none;
          }
          .left{
            width: 90%;
            >p:nth-child(1){
              color: #303030;
              font-size: 24rpx;
              width: 471rpx;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            >p:nth-child(2){
              padding-top: 10rpx;
              color:#606060;
              font-size: 22rpx;
            }
          }
          .right{
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            span{
              color: #E22829;
              font-size: 24rpx;
            }
            >span:nth-child(2){
              padding-top: 10rpx;

            }
          }
        }
      }
    }
  }

</style>
