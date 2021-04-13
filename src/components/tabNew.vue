<template>
  <div id="app">
    <div class="tab">
      <div class="tabItem" v-for="(item,index) in tabList" :key="index" @click="changeTab(item,index)">
        <img v-if="tabCd==item.cd" :src="item.img"/>
        <img v-else :src="item.img1"/>
        <p :class="{redd:tabCd==item.cd}">{{item.nm}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import hm from '../../static/tabs/home.png'
  import hm1 from '../../static/tabs/home_1.png'
  import vd from '../../static/tabs/video.png'
  import vd1 from '../../static/tabs/video_1.png'
  import tk from '../../static/tabs/task.png'
  import tk1 from '../../static/tabs/task_1.png'
  import my from '../../static/tabs/my.png'
  import my1 from '../../static/tabs/my_1.png'
  import at from '../../static/tabs/star.png'
  import at1 from '../../static/tabs/star2.png'
  export default {
    data(){
      return{
        cz:'true',//导航栏是否显示主页和视频
        tabCd:'',//是否选中
        tabList:[],
        key:'show_new_video'
      }
    },
    props:{
      tabCd:{
        type:String,
        default:'task',
      }
    },
    mounted(){
      this.getData();
    },
    async onShow(){
      this.getData();
      // if(!wx.getStorageSync('token')){
      // }
    },
    methods:{
      async getData(){
        let data =await this.api.dhcz()
        if(data == 'false'){
          this.tabList = [{
            nm:'首页',
            img:hm,
            img1:hm1,
            href:'/pages/index/main',
            cd:'index'
          },{
            nm:'任务',
            img:tk,
            img1:tk1,
            href:'/pages/task/index/main',
            cd:'task'
          },{
            nm:'活动',
            img:at,
            img1:at1,
            href:'/pages/activity/index/main',
            cd:'activity'
          },{
            nm:'我的',
            img:my,
            img1:my1,
            href:'/pages/my/index/main',
            cd:'my'
          }]
        }else{
          this.tabList = [{
            nm:'首页',
            img:hm,
            img1:hm1,
            href:'/pages/index/main',
            cd:'index'
          },{
            nm:'视频',
            img:vd,
            img1:vd1,
            href:'/pages/video/index/main',
            cd:'video'
          },{
            nm:'任务',
            img:tk,
            img1:tk1,
            href:'/pages/task/index/main',
            cd:'task'
          },{
            nm:'活动',
            img:at,
            img1:at1,
            href:'/pages/activity/index/main',
            cd:'activity'
          },{
            nm:'我的',
            img:my,
            img1:my1,
            href:'/pages/my/index/main',
            cd:'my'
          }]

        }
      },
      toPage(url){
        wx.reLaunch({url})
      },
      changeTab(item,index){
        // this.tabCd = index
        this.toPage(item.href)
      }
    }
  }
</script>

<style lang="less" scoped>
  #app{
    width: 100%;
    background-color: #FFFFFF;
    /*position:fixed;*/
    /*bottom:0;*/
    /*left:0;*/
    /*z-index:10;*/
    .tab{
      box-shadow: 0 -1rpx 0 0 #cccccc;
      height: 98rpx;
      width: 100%;
      display: flex;
      margin-bottom: 25rpx;
      .tabItem{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        img{
          height: 42rpx;
          width: 42rpx;
        }
        p{
          font-size: 22rpx;
          color: #CCCCCC;
          margin-top: 16rpx;
        }
        .redd{
          color: #E22829;
        }
      }
    }
  }
</style>
