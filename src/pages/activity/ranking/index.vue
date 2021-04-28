<template>
  <div id="index">
    <p class="top-tips">须知:同等人数下按答题时间排名，时间相同时按答题先后顺序</p>
    <div class="content">
      <div class="con-top">
        <div v-for="item in list1" :key="item.id">{{item.nm}}</div>
      </div>
      <div class="con-top-place">
      </div>
      <div class="con-bottom">
        <div v-for="(item,index) in list2" :key="item.id">
          <p v-if="index==0 || index==1 || index==2">
            <img :src="num1" v-if="index==0">
            <img :src="num2" v-if="index==1">
            <img :src="num3" v-if="index==2">
          </p>
          <p  v-else><span class="con-rank">{{index+1}}</span></p>
          <p>{{item.persName}}</p>
          <p>{{item.scores}}</p>
<!--          <p>{{item.dura}}</p>-->
        </div>
      </div>
      <p class="bottom-p" @click="toHome">返回首页</p>
    </div>
  </div>
</template>

<script>
  import num1 from "../../../../static/activity/1.png"
  import num2 from "../../../../static/activity/2.png"
  import num3 from "../../../../static/activity/3.png"
  export default {
    name: "ranking",
    data(){
      return{
        num1,
        num2,
        num3,
        id:'',
        list1:[
          {
            id:1,
            nm:'排行'
          },
          {
            id:2,
            nm:'用户名'
          },
          {
            id:3,
            nm:'分数'
          }],
        list2:[],
        pageNo:1,
        pageize:10,
      }
    },
    components:{
    },
    async onLoad(options){
      this.id = options.id

    },
    async onShow(){
      this.getList();
    },
    methods:{
      async getList(){
        let qry = this.query.new();
        this.query.toW(qry,'topicId',this.id,'EQ')
        // this.query.toO(qry, "scores", "desc");
        this.query.toP(qry, this.pageNo, this.pageSize);
        let data = await this.api.getRanking(encodeURIComponent(this.query.toJsonStr(qry)))
        this.list2 = data.data.list

      },
      getData(){
        let data = this.api.getAnswerRanking()
      },
      toHome(){
        this.until.back()
      },
    }
  }
</script>

<style scoped lang="less">
  #index {
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    background-image: url("http://jiapingan.oss-cn-hangzhou.aliyuncs.com/74d802e44cd8406bb6f45c2921580f32.png");
    background-size: 100% 100%;
    background-repeat:no-repeat;
    position: relative;
    .content{
      box-sizing: border-box;
      width: 690rpx;
      /*height: 9.5rem;*/
      position: absolute;
      /*垂直居中*/
      left: 50%;
      top: 300rpx;
      transform: translateX(-50%);

      .con-top{
        border-top-left-radius: 10rpx;
        border-top-right-radius: 10rpx;
        background: white;
        color: #9A9A9A;
        font-size: 24rpx;
        display: flex;
        border-bottom: 1rpx solid #F6F6F6;
        height: 82rpx;
        align-items: center;
        position: absolute;
        top:0;
        width: 100%;
        div{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .con-top-place{
        height: 82rpx;
      }
      .con-bottom{
        border-bottom-left-radius:10rpx;
        border-bottom-right-radius: 10rpx;
        background: white;
        /*overflow: auto;*/
        max-height: 900rpx;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        div{
          border-bottom: 1rpx solid #F6F6F6;
          height: 150rpx;
          display: flex;
          color: #343434;
          font-size: 24rpx;
          p{
            flex:1;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
              width: 39rpx;
              height: 53rpx;
            }

            .con-rank{
              border-radius: 50%;
              color: white;
              font-size: 18rpx;
              background: #429EE4;
              width: 35rpx;
              height: 35rpx;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

        }

      }
      .bottom-p{
        margin-top: 30rpx;
        width: 100%;
        text-align: center;
        font-size: 46rpx;
        color: #3B3B3B;
        font-family: "华文行楷";
        background: none;
      }


    }
  }
  /*顶部提示*/
  .top-tips{
    position: fixed;
    top:23rpx;
    width: 100%;
    color: white;
    font-size: 22rpx;
    text-align: center;
  }



</style>

