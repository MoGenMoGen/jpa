<template>
  <div class="home">
    <div class="title">
      <p><span></span>{{title}}</p>
      <!--{{currentClass.nm}}-->
      <p>最少投{{minNum}}票  最多投{{maxNum}}票</p>
    </div>
    <div class="list">
      <div v-for="(v,i) in list" :key="i">
        <div class="imgDiv" >
          <img :src="v.imgUrl"/>
          <span>{{v.cd}}</span>
        </div>
        <p style="margin-bottom: 17rpx;">{{v.nm}}</p>
        <span style="margin-bottom: 22rpx;">{{v.votes}}票</span>
        <img src="http://jiapingan.oss-cn-hangzhou.aliyuncs.com/e89dcb8a873b4d8fbc264c182fa26189.png" class="check" v-if="v.checked" @click="toChange(i)"/>
        <img src="../../../../static/images/box.png" class="check" v-if="!v.checked" @click="toChange(i)"/>
      </div>
    </div>
    <div class="button" @click="toVote">
      投票
    </div>
  </div>
</template>

<script>
  import ceshi from '../../../../static/images/测试.jpg'
  export default {
    data() {
      return {
        currentClass:{},
        checkedIds:[],
        list:[],
        pageNo:1,
        pageSize:10,
        total:0,
        title:'优秀党员',
        id:'',//该分组的id,
        maxNum:'',
        minNum:'',
        actId:'',
        postInfo:{
          rmks:'阅读新闻',
          subId:'',
          type:'3',
        },
        city:'',
        cityCd:'',
      };
    },
    components:{

    },
    onLoad(options){
      this.id = options.id
      this.actId = options.actId
      this.title = options.nm
      this.maxNum = options.maxNum
      this.minNum = options.minNum
      this.city = options.city
      this.cityCd = options.cityCd
      this.getData();
      this.getWaitList();
      wx.showToast({
        title: '投票成功！',
        icon:'success',
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    },
    async onShow(){

    },
    methods: {
      async getWaitList(){
        let qry = this.query.new();
        this.query.toW(qry, 'groupId', this.id,'EQ');
        let data =await this.api.getWaitList(encodeURIComponent(this.query.toJsonStr(qry)))
        this.list = data.data.list
      },
      async getData(){
        let data = await this.api.getVoteDetail(this.id)
        this.info = data.data;
        this.postInfo.subId = this.info.id
        this.postInfo.rmks = this.info.nm
      },
      loadMore() {
        this.loading = true;
        if(this.list.length<this.total){
          this.pageNo++
          this.getList()
        }

      },
      toChange(index){
        if(this.checkedIds.length===this.maxNum && !this.list[index].checked){
          wx.showToast({
            title: '已达到最多投票数！',
            icon:'none',
            duration: 1000  // 提示窗停留时间，默认1500ms
          })
          return
        }
        if(this.list[index].checked){
          this.list[index].checked = false
        }else {
          this.list[index].checked = true
        }
        this.$set(this.list,index,this.list[index])
        this.checkedIds = []
        this.list.forEach(item=>{
          if(item.checked){
            this.checkedIds.push(item.id)
          }
        })
      },
      //获取积分
      postIntegral(){
        this.api.postReadNew(JSON.stringify(this.postInfo))
      },
      toVote(){
        if(this.checkedIds.length<this.currentClass.minNum){
          wx.showToast({
            title: `最少要投${this.minNum}票`,
            icon:'none',
            duration: 1000  // 提示窗停留时间，默认1500ms
          })
          return
        }

        let param = {
          province:this.city,
          addrCd:this.cityCd,
          addrNm:this.city,
          actId:this.actId,
          groupId:this.id,
          waitlistIds:this.checkedIds.join(','),
        }
        this.api.toVote(param).then(res=>{
          console.log(res)
          if(res.code == 0){
            console.log(res.code)
            wx.showToast({
              title: '投票成功！',
              icon:'success',
              duration: 1500  // 提示窗停留时间，默认1500ms
            })
            setTimeout(()=>{
              this.until.back();
              this.postIntegral();
            },1500)
          }else{
            return
          }


        })
      },
    },

  };
</script>
<style lang="less" scoped>
  .home{
    height: 100vh;
    width: 100vw;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    background: #ffffff;
    font-size: 16px;
    .title{
      width: 100%;
      overflow: hidden;
      padding: 30rpx 20rpx;
      line-height: 30rpx;
      display: flex;
      display: -webkit-flex;
      box-sizing: border-box;
      border-bottom: 2rpx solid #E0E0E0;
      >p:nth-child(1){
        font-size: 30rpx;
        color: #333333;
        >span{
          display: inline-block;
          float: left;
          margin-right: 10rpx;
          width: 4rpx;
          height: 32rpx;
          background: #E22829;
        }
      }
      >p:nth-child(2){
        text-align: right;
        flex: 1;
        font-size: 24rpx;
        color: #999999;
      }
    }
    .list{
      flex: 1;
      width: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      margin: 20rpx auto;
      >div{
        float: left;
        text-align: center;
        margin: 20rpx 3.7%;
        padding-bottom: 30rpx;
        /*border-bottom: 1px solid #E0E0E0;*/
        &:nth-of-type(2n+1){
          margin-right: 0;
        }
        .imgDiv{
          position: relative;
          display: flex;
          display: -webkit-flex;
          margin-bottom: 10rpx;
          /*background-repeat: no-repeat;*/
          /*background-position: center top;*/
          /*background-size: 100%;*/
          >img{
            width: 330rpx;
            height: 400rpx;
          }
          >span{
            position: absolute;
            top:-8rpx;
            padding-top: 8rpx;
            font-size: 24rpx;
            left: 10rpx;
            width: 50rpx;
            height: 56rpx;
            background: url("http://jiapingan.oss-cn-hangzhou.aliyuncs.com/082249d70d7d48a8b7a3a770f0131def.png") no-repeat;
            background-size: contain;
            text-align: center;
            color: #ffffff;
          }
        }
        >p{
          font-size: 30rpx;
        }
        >span{
          display: block;
          font-size: 30rpx;
          &:first-of-type{
            color: #FF3000;
          }
        }
        .vote{
          display: block;
          margin-top: 6rpx;
          color: #E22829;
        }
        .check{
          width: 40rpx;
          height: 40rpx;
        }
      }
    }
    .button{
      width: 100%;
      background: #E22829;
      color: #ffffff;
      text-align: center;
      line-height: 80rpx;
      height: 80rpx;
    }
  }

</style>
