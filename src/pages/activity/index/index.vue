<template>
  <div class="home">
    <div class="nav">
      <p v-for="(item,index) in navList" :key="item.id" @click="changeActive(item,index)" :class="{red:cd == item.id}">
        {{item.nm}}
        <img v-if="cd == item.id" src="../../../../static/images/Select.png"/>
      </p>
    </div>
    <div class="main">
      <div class="content">
        <div class="sort2" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
          <div>
            <img v-if="cd==2" :src="item.imgUrl"/>
            <img v-else :src="item.imgCover"/>
          </div>
          <div>
            <p>{{item.nm}}</p>
            <p>{{item.actToTm}}</p>
          </div>
        </div>
      </div>
    </div>
    <tab123 :tabCd="tabCd"></tab123>
  </div>
</template>

<script>
  import tab123 from "../../../components/tabNew.vue";
  import ceshi from "../../../../static/images/测试.jpg";
  import QQMapWX from "../../../utils/libs/qqmap-wx-jssdk";
  export default {
    data() {
      return {
        tabCd:'activity',
        navList:[{
          nm:'考试',
          id:'1'
        },{
          nm:'投票',
          id:'2'
        },{
          nm:'问卷',
          id:'3'
        }],
        cd:'1',
        list:[],
        pageNo:'1',
        pageSize:'10',
        total:'',
        city:'',//城市
        prov:'',//省份
      };
    },
    components: {
      tab123,

    },
    async onLoad(e){
      // this.getRegionInfo();

    },
    onShareAppMessage (res) {

    },
    async onShow(){
      if(this.cd == 1){
        this.getAnswerList();
      }
      if(this.cd == 2){
        this.getList();
      }
      if(this.cd == 3){
        this.getAnswerList();
      }
    },
    onPullDownRefresh () {

    },
    onReachBottom () {

    },
    methods: {
      //获取投票列表
      async getList(){
        let qry = this.query.new();
        this.query.toP(qry, this.pageNo, this.pageSize);
        // this.query.toW(qry,'allowArea',wx.getStorageSync('city'),'EQ')
        let data = await this.api.getVoteList(encodeURIComponent(this.query.toJsonStr(qry)));
        // let data = await this.api.getVoteList(encodeURIComponent(this.query.toJsonStr(qry))+'&allowArea=' + wx.getStorageSync('city'));
        this.list = [];
        data.data.list.forEach(item=>{
          item.actFrTm = item.actFrTm ? item.actFrTm.split(' ')[0] : ''
          item.actToTm = item.actToTm ? item.actToTm.split(' ')[0] : ''
        })
        this.list.push(...data.data.list)
        this.total = data.page.total
      },
      //获取考试和问卷列表
      async getAnswerList(){
        let qry = this.query.new();
        this.query.toP(qry, this.pageNo, this.pageSize);
        if(this.cd == 1){
          this.query.toW(qry,'type',1,'EQ')
        }else if(this.cd == 3){
          this.query.toW(qry,'type',2,'EQ')
        }
        let data = await this.api.getAnswerList(encodeURIComponent(this.query.toJsonStr(qry)));
        // let data = await this.api.getAnswerList(encodeURIComponent(this.query.toJsonStr(qry))+'&allowArea=' + wx.getStorageSync('city'));
        this.list = [];
        data.data.list.forEach(item=>{
          item.actFrTm = item.actFrTm ? item.actFrTm.split(' ')[0] : ''
          item.actToTm = item.actToTm ? item.actToTm.split(' ')[0] : ''
        })
        this.list.push(...data.data.list)
        this.total = data.page.total
      },
      changeActive(item){
        this.cd = item.id
        this.pageNo=1
        this.pageSize = 10
        if(this.cd == 1){
          this.getAnswerList();
        }else if(this.cd == 2){
          this.getList();
        }else if(this.cd == 3){
          this.getAnswerList();
        }
      },
      toPage(url){
        this.until.aHref(url)
      },
      toDetail(item){
        if(this.cd == 1){
          let url ='/pages/activity/answer/main?id='+item.id;
          this.until.aHref(url)
        }else if(this.cd == 2){
          let url ='/pages/activity/voteIndex/main?id='+item.id;
          this.until.aHref(url)
        }else if(this.cd == 3){
          let url ='/pages/activity/question/main?id='+item.id;
          this.until.aHref(url)
        }
      },
      //获取用户位置信息
      //  获取用户地址
      getRegionInfo() {
        var that = this,
          qqmapsdk;
        qqmapsdk = new QQMapWX({
          key: "KXXBZ-675KF-JOAJJ-NSX2Q-HYG6H-TMFNI"
        });
        wx.getLocation({
          //获取当前地址
          type: "wgs84",
          success: function(res) {
            // console.log('location')
            // console.log(res)
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180
            //根据经纬度获取所在城市
            qqmapsdk.reverseGeocoder({
              location: { latitude: latitude, longitude: longitude },
              success: function(res) {
                // console.log('res')
                // console.log(res)
                //address 城市
                that.city = res.result.address_component.city
                that.prov = res.result.address_component.province
                wx.setStorageSync('city',that.city);
                wx.setStorageSync('province',that.prov);
                // console.log(that.city,that.prov)
                // that.getList();
              }
            });
          }
        });
      },

    },
  onUnload(){

  },
};
</script>

<style scoped lang="less">
  .home{
    height: 100vh;
    width: 100vw;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    /*margin-top: 160rpx;*/
    .nav{
      width: 100%;
      white-space: nowrap;
      overflow-x:scroll;
      color: #8A8E8E;
      height:74rpx;
      background-color: #FFFFFF;
      &::-webkit-scrollbar { height: 0 !important }
      -ms-overflow-style: none;
      overflow: -moz-scrollbars-none;
      p{
        display: inline-block;
        width: 33.3%;
        font-size: 32rpx;
        color: #666666;
        height: 74rpx;
        line-height: 74rpx;
        align-items: center;
        position: relative;
        text-align: center;
        >img{
          width: 20rpx;
          height: 20rpx;
          position: absolute;
          /*right: 4rpx;*/
          top: 8rpx;
        }
      }
      .red{
        color:#E22829;
        font-weight: bold;
      }
    }
    .main{
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .content{
        width: 100%;
        display: flex;
        flex-direction: column;
        /*margin-top: 74rpx;*/
        .sort2{
          padding: 17rpx 21rpx;
          border-bottom: 1rpx solid #F6F7F9;
          display: flex;
          div:nth-child(2){
            float: right;
            flex: 1;
            max-width: 412rpx;
            margin-left: 53rpx;
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            justify-content: space-between;
            height: 146rpx;
            p:nth-child(1){
              font-size: 36rpx;
              color: #000000;
              word-break: break-all;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2; /* 这里是超出几行省略 */
              overflow: hidden;

            }
            p:nth-child(2){
              font-size: 24rpx;
              color: #999999;
              >span{
                margin-right: 16rpx;
              }
            }
          }
          div:nth-child(1){
            float: left;
            >img{
              width: 234rpx;
              height: 146rpx;
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
    font-size: 30rpx;
    padding-top: 40rpx;

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
    font-size: 30rpx;
    margin-bottom: 30rpx;
  }
</style>
