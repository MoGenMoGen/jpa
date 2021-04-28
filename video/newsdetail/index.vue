<template>
<!--  新闻详情-->
<div class="home">
  <div class="top">

    <div class="title">{{info.nm}}</div>

    <div class="share-cont">
      <p>
        <span>{{info.newsSrc}}</span>
        <span>{{info.updTm}}</span>
      </p>
      <button open-type='share' class="btn-share" ><image :src="wechat" mode="aspectFill" ></image></button>
    </div>

    <div class="cont" >
      <div v-html="info.cont"></div>

    </div>
  </div>

</div>
</template>

<script>
  import play from "../../../../static/images/play.png";
  import wechat from "../../../../static/images/wechat.png";
  import cs from "../../../../static/images/star.png";
  export default {
    data(){
      return{
        play,
        wechat,
          id:'',//新闻id
          info:'',//视频信息
        postInfo:{
          rmks:'阅读新闻',
          subId:'',
          type:'1',
        },
      }
    },
      //配置分享路径
      onShareAppMessage: function (options) {

          return {
              title: this.info.nm,
              desc: "新闻分享",
              path: '/pages/video/newsdetail/main?id='+this.info.id
          }
      },
      onLoad(e){
         console.log("id的值："+e.id)
          this.id=e.id
          this.postInfo.subId = e.id
          this.getDtl(e.id)
      },
      onShow(){
        if(wx.getStorageSync('yui3-token')){
          this.postIntegral();
        }
      },
      onUnload(){
          console.log("page ---onUnload---");
          this.info=""
          this.id=""
      },

    methods:{
        //新闻详情
        async getDtl(id){
            let res=await this.api.getNewsDtl(id)
            console.log("新闻详情的值")
            this.info=res.data
            this.postInfo.rmks = res.data.nm
          console.log(res)
        },
        //获取积分，仅登录后可获取
        postIntegral(){
          this.api.postReadNew(JSON.stringify(this.postInfo))
        },
    }
  }
</script>
<style scoped lang="less">
  .home{
    height: 100%;
    width: 100vw;
    background-color: white;
    .top{
       .title{
         padding:20rpx 30rpx;
         background: white;
         font-size: 35rpx;
       }
      .share-cont{
        padding: 20rpx 30rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #999999;
        font-size: 24rpx;
        background: white;
        .btn-share{
          width: 40rpx;
          height: 40rpx;
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          display: flex;
          outline: none;
          image{
            width: 40rpx;
            height: 40rpx;
          }
          &::after{
            border: none;
          }
        }
      }
      .cont{
        width: 90%;
        margin: 0 auto;
        background: white;
        div{


        }

      }
    }
  }

</style>
