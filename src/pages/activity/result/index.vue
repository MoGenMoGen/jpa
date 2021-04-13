<template>
  <div id="home">
    <!--答题结束-->
    <div class="content" >
      <div class="title">
        <p> <span style="margin-right: 36rpx;">——</span> 答题得分 <span style="margin-left: 36rpx;">——</span> </p>
        <p>{{info.scores}}</p>
      </div>
        <div class="desc">
          <p>正确率：{{info.accuracy}}%</p>
          <p>错题数：{{info.wrong}}</p>
<!--          <p>用时长：{{info.duration}}</p>-->
        </div>
        <div class="foot" >
          <p @click="toBack">返回</p>
          <p @click="toAgain">再来一组</p>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        type:1,
        selectId:1,//选中选项的id
        showWarn:false,//显示警告
        popMsg:'',///弹框提示
        showTips:false,//查看提示
        info:{
          scores:100,
          accuracy:100,
          wrong:0,
          duration:'00:00:12',
        },//试题信息
        tips:'进入左侧道路超车，无法保证与正常行驶前车的横向安全间距时,交替变换远近光灯加速通过',
        list:[],
        //当前选中题目
        current:{
          type:1,
          nm:' 按照目前物理科学研究的最新成果，构成物质的最小单位是：()',
          quesOptionsVos:[{
            nm:'夸克',
            id:'',
            cd:'A',
            ans:'0',
          },{
            nm:'质子',
            id:'',
            cd:'B',
            ans:'0',
          },{
            nm:'中子',
            id:'',
            cd:'C',
            ans:'0',
          },{
            nm:'纳米',
            id:'',
            cd:'D',
            ans:'1',
          }]
        },
        index:1,//题目索引
        total:25,//题目总数
      }
    },
    onLoad(options){
      console.log(options)
      this.info = JSON.parse(options.info)
    },
    onUnload(){
    },
    onShareAppMessage (option) {

    },
    onShow(){
    },
    methods:{
      toBack(){
        this.until.aHref('/pages/activity/index/main')
      },
      toAgain(){
        this.until.aHref('/pages/activity/index/main')
      },
    }
  }
</script>

<style scoped lang="less">
  #home{
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    background-image: url("http://jiapingan.oss-cn-hangzhou.aliyuncs.com/cea4cf08ff324d6f8c4eb93e5733cbe2.png");
    background-size: 100% 100%;
    background-repeat:no-repeat;
    position: relative;
    .content{
      background-color: #FFFFFF;
      border-radius: 10rpx;
      width: 584rpx;
      height: 668rpx;
      position: absolute;
      left: 83rpx;
      top: 24%;
      display: flex;
      box-sizing: border-box;
      padding: 0;
      flex-direction: column;
      .title{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        >p:nth-child(1){
          font-size: 24rpx;
          color: #333333;
          margin-top: 60rpx;
          span{
            color: rgba(0,0,0,0.1);
          }
        }
        >p:nth-child(2){
          font-size: 82.14rpx;
          color: #F32730;
          margin-top: 32rpx;
        }
      }
      .desc{
        margin-top: 45rpx;
        padding: 0 56rpx;
        p{
          font-size: 26rpx;
          color: #333333;
          line-height: 40rpx;
        }
      }
      .foot{
        margin-top: 127rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        >p:nth-child(1){
          width: 239rpx;
          height: 63rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F32730;
          font-size: 24rpx;
          border-radius: 40rpx;
          border: 1rpx solid #F32730;
          margin-right: 30rpx;
        }
        >p:nth-child(2){
          width: 239rpx;
          height: 63rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 24rpx;
          background-color: #F32730;
          border-radius: 40rpx;
        }
      }
    }
  }

</style>
