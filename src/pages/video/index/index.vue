<template>
<div class="home">
  <div class="main">
    <div class="list" v-for="(item,index) in newsList" :key="index" @click="toPage(item)">
      <image class="imgMain" :src="item.imgUrl" mode="aspectFill"></image>
      <p class="nm">{{item.nm}}</p>
      <img class="play" :src="play"/>

      <div class="bottom">
        <p class="left"><span>{{item.newsSrc}}</span>{{item.releTm}}</p>
        <button open-type='share'
                class="btn-share"
                @click.stop
                :data-id="item.id" :data-nm="item.nm" >
          <image :src="wechat" mode="aspectFill"></image>
        </button>
      </div>
    </div>
    <div class="noData" v-if="(newsList.length==0)">
      暂无数据
    </div>
    <div v-if="finished && newsList.length>0" class="finished">全部加载完</div>
  </div>
  <tab123 :tabCd="tabCd"></tab123>
</div>
</template>

<script>
  import play from "../../../../static/images/play.png";
  import wechat from "../../../../static/images/wechat.png";
  import cs from "../../../../static/images/star.png";
  import tab123 from "../../../components/tabNew.vue";
  export default {
    data(){
      return{
        play,
        wechat,
        tabCd:'video',
          pageNo:1,
          pageSize:10,
          newsList:[],//新闻列表
          finished:false,//标记是否已经加载完
      }
    },
    components: {
      tab123,
    },
      //配置分享路径
      onShareAppMessage: function (options) {
          console.log("分享参数。。。")
          console.log(options)
        return {
            title: '热门视频',
            desc: "视频",
            path: '/pages/video/index/main'
        }
     },
      onLoad(){
          this.getList()
      },

    methods:{
      toPage(item){
          let url='/pages/video/detail/main?id='+item.id
        this.until.aHref(url)
      },
        //获取新闻列表
        async  getList(){
            let qry = this.query.new();
            this.query.toW(qry, "type",  20, "EQ");
            // this.query.toW(qry, "type",  10, "EQ");
            this.query.toW(qry, "audit",  20, "EQ");
            this.query.toO(qry, "istop", "desc");
            this.query.toO(qry, "sort", "desc");
            this.query.toP(qry, this.pageNo, this.pageSize);
            let res=await  this.api.getNewsList(encodeURIComponent(this.query.toJsonStr(qry)))
            wx.stopPullDownRefresh()
            this.newsList.push(...res.data.list)
          this.newsList.forEach(item=>{
            item.releTm=item.releTm.split(' ')[0]
          })
            console.log("新闻列表")
            console.log(this.newsList)
            //表示已经加载完
            if(res.data.list.length>=res.page.total){
                this.finished=true
            }

        }

    },
      onUnload(){
          console.log("page ---onUnload---");
          this.pageNo = 1
          this.newsList=[]
          this.finished=false
      },

      onPullDownRefresh () {
          // 初始化页码
          this.pageNo = 1
          this.newsList=[]
          this.finished=false
          this.getList()
      },
      onReachBottom () {

          if(!this.finished){
              console.log('开始加载')
              this.pageNo++
              this.getList()
          }
      },
  }
</script>
<style scoped lang="less">
  .home{
    height: 100vh;
    width: 100vw;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    .main{
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .list{
        width: 100%;
        height: 600rpx;
        position: relative;
        .imgMain{
          width: 100%;
          height: 460rpx;
        }
        .nm{
          position: absolute;
          color: #FFFFFF;
          left: 21rpx;
          top: 21rpx;
          font-size: 36rpx;
          line-height: 50rpx;
          width: 560rpx;
        }
        .play{
          position: absolute;
          left: 50%;
          top: 40%;
          transform: translate(-50%,-50%);
          width: 140rpx;
          height: 140rpx;
        }

        .right{
          float: right;
          width: 35rpx;
          height: 35rpx;
          padding: 20rpx;
        }

        .bottom{
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: 30rpx;
          .left{
            float: left;
            width: 600rpx;
            color: #999999;
            font-size: 24rpx;
            padding: 20rpx 30rpx;
            >span{
              margin-right: 10rpx;
            }
          }

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
    }
  }
  //空布局
  .noData{
    width:100%;
    flex: 1;
    text-align: center;
    color: #999999;
    font-size: 20rpx;
    padding-top: 40rpx;
    background: #ffffff;
    img{
      width: 40rpx;
      height: 40rpx;

      margin-bottom: 10rpx;
    }
  }
  /*加载完成布局*/
  .finished{
    width: 100%;
    color: #999999;
    text-align: center;
    font-size: 20rpx;
    margin-bottom: 30rpx;
  }

</style>
