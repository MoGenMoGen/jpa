<template>
  <div class="home">
    <web-view :src="url"></web-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        url:'',
        titleName:'',//页面名字
        postInfo:{
          rmks:'阅读新闻',
          subId:'',
          type:'1',
        },
        info:{},
      };
    },

    watch:{

    },
      onUnload(){
          this.url=''

      },
    onShareAppMessage (res) {
      console.log(res)
      let url = encodeURIComponent(this.url)
      console.log(encodeURIComponent(this.url))
      return {
        title: '分享',
        desc: "分享",
        path: '/pages/wxDetail/main?url='+url
      }
    },
    async onLoad(e) {
      // let url = ' http://mp.weixin.qq.com/s?__biz=MzUzNTg0MjYxNg==&mid=100000085&idx=1&sn=57b8599bc06bf305131a0e0b2cce1066&chksm=7afe1b024d89921404dbae3ec0824e34c0514facf25a73d29f73bd02b1c558d278a864651bf3#rd'
      // let url1 = encodeURIComponent(urel)
      // console.log(decodeURIComponent(url1))
      // this.url = decodeURIComponent(url1)
      console.log(e)
      if(e.url){
          this.url=decodeURIComponent(e.url)
        }
        if(e.id){
        console.log('========获取详情')
          if(wx.getStorageSync('yui3-token')){
            this.postInfo.subId = e.id
          }
          let res=await this.api.getNewsDtl(e.id)
          this.url=res.data.linkUrl
          this.postInfo.rmks = res.data.nm //获取新闻名称
          console.log(res)
          this.postIntegral();
        }
        if(e.postInfo){
          console.log(e.postInfo,'postInfo')
          this.info = JSON.parse(e.postInfo)
          this.api.taskPersLink(JSON.stringify(this.info)).then(res=>{
            if(res.code == 0){
              wx.showToast({
                title: '已完成任务！', // 标题
                icon: 'success',  // 图标类型，默认success
                duration: 1500  // 提示窗停留时间，默认1500ms
              })
            }
          })
        }


    },

    async onShow() {
      this.getxmmc();
    },
    methods: {
      //获取积分
      postIntegral(){
        this.api.postReadNew(JSON.stringify(this.postInfo))
      },
      async getxmmc(){
        let data = await this.api.xmmc()
        this.titleName = data
        wx.setNavigationBarTitle({
          title: this.titleName
        })
      },
    }
  };
</script>

<style scoped lang="less">
  .home{
    height: 100%;
    width: 100vw;
  }

</style>
