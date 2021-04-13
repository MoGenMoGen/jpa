<template>
  <div id="home">
    <div class="center">
      <p class="title"><span></span>总排行榜</p>
      <div class="cont">
        <div v-for="(item,index) in rankingList" :key="index">
          <p>
            <img v-if="index==0" src="../../../../static/activity/1.png"/>
            <img v-else-if="index==1" src="../../../../static/activity/2.png"/>
            <img v-else-if="index==2" src="../../../../static/activity/3.png"/>
            <span class="gray" v-else>{{index+1}}</span>
            {{item.nm}}</p>
          <p>{{item.votes}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
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
        total:'',
        pageNo:1,
        pageSize:10,
      };
    },
    components:{
    },
    created(){
    },
    mounted() {

    },
    onLoad(options){
      this.id = options.id
      // this.getVoteRanking();
    },
    async onShow(){
      this.pageNo=1,
      this.rankingList=[]
      this.getVoteRanking();

    },
    onReachBottom(){
      console.log('上拉')
      if(this.rankingList.length>=this.total){
        return
      }
      if(this.rankingList.length<this.total){
        this.pageNo++
        this.getVoteRanking()
      }
    },
    methods: {
      //获取排行榜
      async getVoteRanking(){
        let qry = this.query.new();
        this.query.toW(qry, 'actId', this.id,'eq');
        this.query.toO(qry, 'votes', 'desc');
        this.query.toP(qry, this.pageNo, this.pageSize);
        let data = await this.api.getVoteRanking(encodeURIComponent(this.query.toJsonStr(qry)))
        this.rankingList.push(...data.data.list)
        this.total = data.page.total
      },

    },

  };
</script>
<style lang="less" scoped>
  #home{
    height: 100%;
    width: 100vw;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    font-size: 16px;
    background-color: #FFFFFF;
    box-sizing: border-box;
    .center{
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
            .gray{
              background: #999999;
              width: 43rpx;
              height: 43rpx;
              border-radius: 50%;
              color: #FFFFFF;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 24rpx;

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
    }

  }


</style>
