<template>
  <div class="home" :style="{backgroundImage:'url('+ srcUrl+')'}">
    <p @click="toPage">{{time}}S跳过</p>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        time:5,
        timer:null,
        srcUrl:'',
        cz:'true',//导航栏是否显示主页和视频
      };
    },
    onLoad(options) {

    },
    watch:{

    },
    async onShow(){
      this.getData();
      this.timeShow()
      this.getCz();
    },
    mounted() {
      this.getCz();
    },
    onShareAppMessage (res) {
      return {
        title: '引导页',
        desc: "引导页",
        path: '/pages/loading/main'
      }
    },
    methods: {
      timeShow(){
        this.time = 5;
        this.timer = setInterval(()=>{
          if(this.time>0){
            this.time--
          }else {
            this.toPage()
          }
        },1000)
      },
      //判断任务首页还是登录页
      async getCz(){
        this.cz =await this.api.dhcz()

      },
      toPage(){
        clearInterval(this.timer)
        if(this.cz == 'true'){
          let url = '/pages/index/main'
          wx.reLaunch({ url });
        }else{
          let url = '/pages/task/index/main'
          wx.reLaunch({ url });
        }
        // wx.switchTab({ url });
      },
      //轮播图
      async getData(){
        let qry = this.query.new()
        this.query.toW(qry,'cd','loading')
        let data = await this.api.banner(this.query.toEncode(qry))
        this.srcUrl = data.data.list[0].srcUrl
      },
    }
  };
</script>

<style lang="less" scoped>
  .home {
    width: 100vw;
    height: 100vh;
    background-size: cover;
    >p{
      position: fixed;
      z-index: 99;
      bottom:40rpx;
      left: 41vw;
      background: rgba(255,255,255,0.65);
      border-radius: 5rpx;
      padding: 8rpx 0;
      text-align: center;
      width: 18vw;
    }
  }
</style>
