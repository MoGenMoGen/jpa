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
          <p>{{item.nm}}</p>
          <p>{{item.scores}}</p>
          <p>{{item.crtTm}}</p>
        </div>
        <p class="more" v-if="list2.length<total" @click="toMore()">点击加载更多</p>
        <p class="more" v-else>已经加载完了</p>
      </div>
      <p class="bottom-p" @click="toHome">返回首页</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ranking",
    data(){
      return{
        id:'',
        list1:[
          {
            id:1,
            nm:'活动名称'
          },
          {
            id:2,
            nm:'分数'
          },
          {
            id:3,
            nm:'时间'
          }],
        list2:[],
        pageNo:1,
        pageSize:10,
        total:0,
      }
    },
    components:{
    },
    async onLoad(options){
      this.id = options.id

    },
    async onShow(){
      this.pageNo = 1;
      this.list2 = [];
      this.getList();
    },
    methods:{
      async getList(){
        let qry = this.query.new();
        this.query.toP(qry, this.pageNo, this.pageSize);
        this.query.toW(qry,'topicId',this.id,'EQ');
        // this.query.toO(qry,'crtTm','desc');
        let data = await this.api.getAnswerNotes(encodeURIComponent(this.query.toJsonStr(qry)));
        this.total = data.page.total
        console.log(this.total)
        // data.data.list.forEach(item=>{
        //   item.quesQuestionVo.nm = item.quesQuestionVo.nm.slice(0,15)
        // })
        this.list2.push(...data.data.list)
        console.log(this.list2.length)
      },
      toMore(){
        this.pageNo++
        this.getList();
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
    background-image: url("http://jiapingan.oss-cn-hangzhou.aliyuncs.com/9b49e2f401434f7498296810a53efa81.png");
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
        padding: 0 38rpx;
        box-sizing: border-box;
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
        /*display: flex;*/
        height: 836rpx;
        padding: 0 38rpx;
        flex-direction: column;
        overflow-y: auto;
        div{
          border-bottom: 1rpx solid #F6F6F6;
          height: 150rpx;
          display: flex;
          align-items: center;
          color: #343434;
          font-size: 24rpx;
          p{
            flex:1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            /*display: -webkit-box;*/
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-align: center;
          }
        }
        .more{
          display:flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          color: #343434;
          font-size: 24rpx;
          height: 60rpx;
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

