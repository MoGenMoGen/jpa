<template>
  <div class="home">
<!--    <web-view :src="url"></web-view>-->
    <div class="table">
      <ul>
        <li v-for="(item,index) in list" :key="index" @click="toPlay(item)">
          <p>
            {{item.nm}}
          </p>
          <img src="../../../../static/my/line.png" style="width: 14rpx;height: 22rpx;"/>
        </li>
      </ul>
    </div>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        url:'',
        pageNo:1,
        pageSize:10,
        list:[],
        total:'',
      };
    },
    watch:{

    },
    onUnload(){
      this.list=[]
    },
    onReachBottom () {

      if(this.list.length<this.total){
        this.pageNo++
        this.getList()
      }
    },
    onShareAppMessage (res) {
      return {
        title: "操作手册",
        desc: "操作手册",
        path: '/pages/my/support/main'
      }
    },
    onLoad() {

    },

    async onShow() {
        // this.url = await this.api.czsc()
      this.list=[]

      this.getHelp();
    },
    methods: {
      async getHelp(){
        let qry = this.query.new();
        this.query.toP(qry, this.pageNo, this.pageSize);
        let data = await this.api.getHelp(encodeURIComponent(this.query.toJsonStr(qry)))
        this.total = data.page.total
        this.list.push(...data.data.list)
      },
      async toPlay(item){
        let data =await this.api.getHelpInfo(item.id)

        let url = data.data.url
        let newUrl = encodeURIComponent(url)
        this.toPage('/pages/wxDetail/main?url='+newUrl)
      },
      toPage(url){
        this.until.aHref(url)
      }
    }
  };
</script>

<style scoped lang="less">
  .home{
    min-height: 100vh;
    width: 100vw;
    background-color: rgba(242, 242, 242, 0.58);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 0 20rpx;

    .table{
      background-color: #FFFFFF;
      display: flex;
      flex-direction: column;
      margin-top: 20rpx;
      border-radius: 10rpx;
      ul li{
        display: flex;
        align-items: center;
        flex: 1;
        height: 101rpx;
        padding: 0 25rpx;
        border-bottom: 1rpx solid #E5E5E5;
        &:last-of-type{
          border-bottom: none;
        }
        p{
          flex: 1;
          font-size: 30rpx;
          color: #303030;
        }
      }
      }
    }
</style>
