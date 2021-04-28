<template>
<div class="home">
  <div class="top">
    <video id="myVideo" :src="info.linkUrl"
           @error="videoErrorCallback"
            controls autoplay loop title @play="toPlayDtl" >
    </video>
    <div class="share-cont">
      <p>
        <span>{{info.newsSrc}}</span>
        <span style="margin-left: 20rpx;">{{info.releTm}}</span>
      </p>
      <button open-type='share' class="btn-share" ><image :src="wechat" mode="aspectFill" ></image></button>
    </div>

  </div>

  <div class="bottom">
    <p class="title">精彩推荐</p>

    <div  class="bottom-1">
      <div class="item" v-for="item in newsList" :key="item.id" @click="toPage(item)">
        <div class="left">
          <p>{{item.nm}}</p>
          <p><span>{{item.newsSrc}}</span><span style="margin-left: 20rpx;">{{item.releTm}}</span></p>
        </div>
        <div class="right">
          <img :src="item.imgUrl"/>
<!--          <video-->
<!--                  :id="item.id"-->
<!--                 class="list-video"  :src="item.linkUrl"-->
<!--                 @error="videoErrorCallback"-->
<!--                 controls @play="toPlay(item)">-->
<!--          </video>-->
        </div>
      </div>

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
          newsList:[],//推荐列表
          pageNo:1,
          pageSize:10,
          id:'',//新闻id
          info:'',//视频信息
          src:"http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
          currentId:'',//当前播放id
          postInfo:{
              rmks:'阅读视频',
              subId:'',
              type:'1',//1是新闻资讯
          },
      }
    },
      //配置分享路径
      onShareAppMessage: function (options) {

          return {
              title: this.info.nm,
              desc: "视频分享",
              path: '/pages/video/detail/main?id='+this.id
          }
      },
      onLoad(e){
         console.log("id的值："+e.id)
          this.id=e.id
          this.postInfo.subId = e.id
          this.newsList = []
          this.getDtl(e.id)
          this.getList()
      },
      onUnload(){
          console.log("page ---onUnload---");
          this.pageNo = 1
          this.newsList=[]
          this.info=""
          this.id=""
      },
      onShow(){
        if(wx.getStorageSync('yui3-token')){
            this.postIntegral();
        }
      },
      methods:{
          //新闻详情
          async getDtl(id){
              let res=await this.api.getNewsDtl(id)
              console.log("新闻详情的值")
              this.info=res.data
              this.postInfo.rmks = res.data.nm
              this.info.releTm=this.info.releTm.split(' ')[0]
              wx.setNavigationBarTitle({
                title: this.info.nm
              })
              console.log(res)
          },
          //阅读获得积分
          postIntegral(){
              this.api.postReadNew(JSON.stringify(this.postInfo))
          },
          //推荐列表
          async  getList(){
              let qry = this.query.new();
              this.query.toW(qry, "type",  20, "EQ");
              this.query.toW(qry, "audit",  20, "EQ");
              this.query.toW(qry, "id",  this.id, "NE");
              this.query.toP(qry, this.pageNo, this.pageSize);
              let res=await  this.api.getRecmmondList(encodeURIComponent(this.query.toJsonStr(qry)))
              this.newsList.push(...res.data.list)
              this.newsList.forEach(item=>{
                item.releTm=item.releTm.split(' ')[0]
              })

          },

          //暂停所有列表的播放
          toPlayDtl(){
              for(let i=0;i<this.newsList.length;i++){
                  let context=wx.createVideoContext(this.newsList[i].id.toString());
                  context.pause()
              }
          },
          toPlay(item){
            console.log("开始播放id："+item.id)
              this.currentId=item.id
              //停止详情播放器
              let dtlContext=wx.createVideoContext("myVideo");
              dtlContext.pause()
              for(let i=0;i<this.newsList.length;i++){
                  /*
                  videoContext通过 videoId 跟一个 video 组件绑定，通过它可以操作一个 video 组件。
                   */
                  let context=wx.createVideoContext(this.newsList[i].id.toString());
                  if(this.newsList[i].id!=this.currentId){
                      context.pause()
                  }
              }
          },
        toPage(item){
          let url='/pages/video/detail/main?id='+item.id
          wx.redirectTo({url})
        },
          videoErrorCallback(){

          }
      }
  }
</script>
<style scoped lang="less">
  .home{
    height: 100%;
    width: 100vw;
    background-color: rgba(245, 245, 245, 0.58);
    box-sizing:border-box;
    .top{
      #myVideo{
        width: 100%;
        height: 400rpx;
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
    }
    .bottom{
      background: white;
      width: 100%;

      .title{
        color: #333333;
        text-align: center;
        font-weight: bold;
        font-size: 30rpx;
        padding-top: 56rpx;
        margin-bottom: 67rpx;
      }
      .bottom-1{
        width: 100%;

        .item{
          padding: 10rpx 20rpx;
          width: 100%;
          display: flex;
          box-sizing: border-box;
          /*border-bottom: 1px solid rgba(0,0,0,0.1);*/
          .left{
            flex: 6;
            margin-right: 20rpx;
            p:nth-of-type(1){
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            p:nth-of-type(2){
              font-size: 24rpx;
              color: #999999;
              margin-top: 20rpx;
            }
          }
          .right{
             flex: 4;
            img{
              width: 85%;
              height: 150rpx;
            }
            /*.list-video{*/

            /*  width: 85%;*/
            /*  height: 150rpx;*/
            /*}*/
          }
        }
      }


    }
  }

</style>
