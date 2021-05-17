<template>
  <div
    class="home"
    @touchstart="touchStart"
    @touchend="touchEnd"
    @touchmove="touchMove"
  >
    <!--标题以及下拉框-->
    <frames ></frames>
    <!--      <span></span><p>浙江社会治理融媒云手机版</p>-->
    <!--首页导航栏-->
    <div
      class="nav"
      :class="{ Aclass: navList.length <= 6, Bclass: navList.length > 6 }"
    >
      <p
        v-for="(item, index) in navList"
        :key="index"
        @click="changeActive(item, index)"
        :class="{ red: cd == item.cd }"
      >
        {{ item.nm }}
        <img v-if="cd == item.cd" src="../../../static/images/Select.png" />
      </p>
    </div>
    <div class="main">
      <!--下部内容栏-->
      <!-- <div
            class="image"
            :style="{ backgroundImage: 'url(' + item.imgUrl + ')' }"
          >
            <div>
              <img class="no" :src="no1" v-if="index == 0" />
              <img class="no" :src="no2" v-if="index == 1" />
              <img class="no" :src="no3" v-if="index == 2" />
              <p>{{ item.nm }}</p>
              <p>{{ item.releTm }}</p>
            </div>
          </div>
          <p class="nm">
            <span style="font-weight: bold">热门</span>{{ item.nm }}
          </p> -->
      <div class="content">
        <!-- cd=='top' 头条-->
        <div
          class="sort1"
          v-for="(item, index) in newsList"
          v-if="cd == 'top'"
          :key="index"
          @click="toDetail(item)"
        >
          <div>
            <div class="no-absolute">
              <img class="no" :src="no1" v-if="index == 0" />
              <img class="no" :src="no2" v-if="index == 1" />
              <img class="no" :src="no3" v-if="index == 2" />
            </div>
            <img :src="item.imgUrl" />
          </div>
          <div>
            <p>{{ item.nm }}</p>
            <p>
              <span>{{ item.newsSrc }}</span
              >{{ item.releTm }}
            </p>
          </div>
        </div>
        <!-- 普通排列-->
        <div
          class="sort2"
          v-if="cd != 'top' && showType == 10"
          v-for="(item, index) in newsList"
          :key="index"
          @click="toDetail(item)"
        >
          <div>
            <p>{{ item.nm }}</p>
            <p>
              <span>{{ item.newsSrc }}</span
              >{{ item.releTm }}
            </p>
          </div>
          <div>
            <img :src="item.imgUrl" />
          </div>
        </div>
        <!-- 图集-->
        <div
          class="sort3"
          v-if="cd != 'top' && showType == 20"
          v-for="(item, index) in newsList"
          :key="index"
          @click="toDetail(item)"
        >
          <p>{{ item.nm }}</p>
          <image :src="item.imgUrl" mode="aspectFill"></image>
          <p class="from">
            <span>{{ item.newsSrc }}</span
            >{{ item.releTm }}
          </p>
        </div>
      </div>

      <div class="noData" v-if="newsList.length == 0">
        <!--      <img src="https://hsyxxcx.oss-cn-hangzhou.aliyuncs.com/408d15ed472842cd9f39d06c49704236.png"/><br/>-->
        暂无数据
      </div>
      <div v-if="finished && newsList.length > 0" class="finished">
        全部加载完
      </div>
    </div>

    <tab123 :tabCd="tabCd"></tab123>
  </div>
</template>

<script>
import cs from "../../../static/images/star.png";
import no1 from "../../../static/images/no1.png";
import no2 from "../../../static/images/no2.png";
import no3 from "../../../static/images/no3.png";
import tab123 from "../../components/tabNew.vue";
import frames from "../../components/frames.vue";
export default {
  data() {
    return {
      no1,
      no2,
      no3,
      tabCd: "index",
      //导航栏
      navList: [],
      list2: [], //子组件向父组件传递
      cd: 1, //此时选中nav
      pageNo: 1,
      pageSize: 10,
      index: 0,
      catId: "", //当前分类
      newsList: [], //新闻列表
      finished: false, //标记是否已经加载完
      showType: 10, //新闻列表10，
      time: 0, //触屏时间
      timer: "", //定时器
      touch: {
        //记录手指触碰时的坐标值
        x: "",
        y: "",
      },
      endTouch: {
        //结束触屏时的坐标值
        x: "",
        y: "",
      },
      //系统信息
      navHeight: "",
      StatusBar: "",
      CustomBar: "",
      windowHeight: "",
    };
  },
  components: {
    tab123,
    frames,
  },
  // onReady: function () {
  //   wx.getSystemInfo({
  //     success: res => {
  //       console.log('res',res)
  //       let custom = wx.getMenuButtonBoundingClientRect();
  //       console.log('custom',custom)
  //       let statusBarHeight = res.statusBarHeight;
  //       console.log('statusBarHeight',statusBarHeight)
  //       let navTop = custom.top;
  //       console.log('navTop',navTop)
  //       let navHeight = statusBarHeight + custom.height + (custom.top - statusBarHeight) * 2;
  //       console.log('navHeight',navHeight)
  //       this.navHeight = navHeight; //导航高度
  //       this.StatusBar = navTop;   //胶囊按钮与顶部的距离
  //       this.CustomBar = custom.bottom + custom.top - statusBarHeight; /**导航栏高度 */
  //       this.windowHeight = res.windowHeight; //屏幕高度
  //       console.log('导航高度',this.navHeight)
  //       console.log('胶囊按钮与顶部的距离',this.StatusBar)
  //       console.log('/**导航栏高度 */',this.CustomBar)
  //       console.log('屏幕高度',this.windowHeight)
  //
  //     }
  //   })
  // },
  async onLoad(e) {
    let res = await this.api.getNewsCat();
    //  let rebang={
    //      id:1,
    //      cd:'rebang',
    //      nm:'热榜',
    //      type:10,
    //  }
    //  this.navList.push(rebang)
    this.navList.push(...res.data.list);
    this.index = 0;
    // this.changeActive(rebang);
    this.changeActive(res.data.list[0]);
    // console.log("新闻分类列表")
    // console.log(res)
  },
  onShareAppMessage(res) {
    return {
      title: "新闻页",
      desc: "新闻分享",
      path: "/pages/index/main",
    };
  },
  onShow() {
    if (wx.getStorageSync("ifShow")) {
      wx.showModal({
        title: "提示",
        content: "您已登录成功，请到“个人中心”做绑定单位操作",
        success(res) {
          if (res.confirm) {
            // wx.switchTab({url:'/pages/my/index/main'})
            wx.reLaunch({ url: "/pages/my/index/main" });
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        },
      });
      wx.removeStorageSync("ifShow");
    }
    this.list2 = [];
    if(wx.getStorageSync("userInfo").updatedunitAddrCd)
    this.list2.push(wx.getStorageSync("userInfo").updatedunitAddrCd);
    else
    this.list2.push(wx.getStorageSync("userInfo").unitAddrCd);

      // console.log('this.list2',this.list2)
      this.pageNo = 1;
      this.newsList = [];
      this.getList();
  },
  onPullDownRefresh() {
    // 初始化页码
    this.pageNo = 1;
    this.newsList = [];
    this.finished = false;
    this.getList();
  },
  onReachBottom() {
    if (!this.finished) {
      // console.log('开始加载')
      this.pageNo++;
      this.getList();
    }
  },
  methods: {
    toDetail(item) {
      if (item.type == 10) {
        let url = "/pages/video/newsdetail/main?id=" + item.id;
        this.until.aHref(url);
      } else if (item.type == 30) {
        let url = `/pages/wxDetail/main?id=${item.id}`;
        this.until.aHref(url);
      }
    },
    updateCity(data) {
      console.log("data", data);
      this.list2 = data;
      // console.log('this.list2',this.list2)
      this.pageNo = 1;
      this.newsList = [];
      this.getList();
    },
    changeActive(item) {
      this.cd = item.cd;
      this.catId = item.id;
      this.showType = item.type;
      this.pageNo = 1;
      this.newsList = [];
      this.getList();
      // console.log('index',this.index)
    },
    //获取新闻列表
    async getList() {
      let qry = this.query.new();
      //请求热榜(原来)
      // 请求头条
      // if (this.cd == "top") {
      //   this.query.toW(qry, "ishot", 1, "EQ");
      // } else {
      this.query.toW(qry, "catId", this.catId, "EQ");
      // }
      this.query.toW(qry, "type", 20, "NE");
      this.query.toW(qry, "audit", 20, "EQ");
      this.query.toO(qry, "istop", "desc");
      this.query.toO(qry, "sort", "desc");
      this.query.toO(qry, "releTm", "desc");
      // if(this.list2.length == 0){
      //   this.list2 = ['']
      // }
      this.query.toW(qry, "addrCd", this.list2, "IN");
      this.query.toP(qry, this.pageNo, this.pageSize);
      let res = await this.api.getNewsList(
        encodeURIComponent(this.query.toJsonStr(qry))
      );
      wx.stopPullDownRefresh();
      this.newsList.push(...res.data.list);
      this.newsList.forEach((item) => {
        item.releTm = item.releTm.split(" ")[0];
      });
      // console.log("新闻列表")
      // console.log(this.newsList)
      //表示已经加载完
      if (res.data.list.length >= res.page.total) {
        this.finished = true;
      }
    },
    // //触屏开始
    // touchStart(e){
    //   this.touch.x = e.touches[0].pageX;
    //   this.touch.y = e.touches[0].pageY;
    //   this.timer = setInterval(()=>{
    //     this.time++;
    //     }, 100);
    //   console.log(this.touch,'开始')
    // },
    touchEnd(e) {
      this.endTouch.x = e.mp.changedTouches[0].clientX;
      this.endTouch.y = e.mp.changedTouches[0].clientY;
      // if ((this.endTouch.x - this.touch.x) > 0 && (this.endTouch.y - this.touch.y) < 50) {
      //   console.log('左滑')
      //   if(this.index >= 1 ){
      //     this.changeActive(this.navList[this.index-1])
      //     this.index = this.index-1
      //   }else{
      //     return
      //   }
      // }
      // //向右滑处理
      // if ((this.endTouch.x - this.touch.x) < 0 && (this.endTouch.y - this.touch.y) < 50 ) {
      //   console.log('右滑')
      //   if(this.index<this.navList.length-1){
      //     this.changeActive(this.navList[this.index+1])
      //     this.index = this.index+1
      //   }else{
      //     return
      //   }
      // }
    },
    touchMove(e) {
      // console.log(e)
    },
  },
  onUnload() {
    console.log("page ---onUnload---");
    this.pageNo = 1;
    this.newsList = [];
    this.navList = [];
    this.finished = false;
    this.catId = "";
    this.cd = 1;
    this.showType = 10;
    clearInterval(this.timer);
  },
};
</script>

<style scoped lang="less">
.home {
  height: 100vh;
  width: 100vw;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  /*margin-top: 160rpx;*/
  .Aclass {
    display: flex;
    p {
      flex: 1;
    }
  }
  .Bclass {
    p {
      width: 15vw;
    }
  }
  .nav {
    width: 100%;
    white-space: nowrap;
    overflow-x: scroll;
    color: #8a8e8e;
    height: 74rpx;
    background-color: #ffffff;
    /*position:fixed;*/
    /*top:0;*/
    /*left:0;*/
    /*z-index:10;*/
    &::-webkit-scrollbar {
      height: 0 !important;
    }
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;

    p {
      display: inline-block;
      font-size: 32rpx;
      color: #666666;
      height: 74rpx;
      line-height: 74rpx;
      align-items: center;
      position: relative;
      text-align: center;
      > img {
        width: 20rpx;
        height: 20rpx;
        position: absolute;
        /*right: 4rpx;*/
        top: 8rpx;
      }
    }
    .red {
      color: #e22829;
      font-weight: bold;
    }
  }
  .main {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      .sort1 {
        padding: 17rpx 21rpx;
        border-bottom: 1rpx solid #fafafa;
        div:nth-child(1) {
          float: left;
          position: relative;
          .no-absolute {
            position: absolute;
            top: 0;
            left: 0;
            .no {
              width: 110rpx;
              height: 45rpx;
            }
          }
          img {
            width: 251rpx;
            height: 146rpx;
          }
        }

        div:nth-child(2) {
          float: right;
          max-width: 412rpx;
          display: flex;
          display: -webkit-flex;
          flex-direction: column;
          justify-content: space-between;
          height: 146rpx;

          p:nth-child(1) {
            font-size: 36rpx;
            color: #000000;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2; /* 这里是超出几行省略 */
            overflow: hidden;
          }
          p:nth-child(2) {
            font-size: 24rpx;
            color: #999999;
            > span {
              margin-right: 16rpx;
            }
          }
        }
      }

      .sort2 {
        padding: 17rpx 21rpx;
        border-bottom: 1rpx solid #fafafa;
        div:nth-child(1) {
          float: left;
          max-width: 412rpx;
          display: flex;
          display: -webkit-flex;
          flex-direction: column;
          justify-content: space-between;
          height: 146rpx;

          p:nth-child(1) {
            font-size: 36rpx;
            color: #000000;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2; /* 这里是超出几行省略 */
            overflow: hidden;
          }
          p:nth-child(2) {
            font-size: 24rpx;
            color: #999999;
            > span {
              margin-right: 16rpx;
            }
          }
        }
        div:nth-child(2) {
          float: right;
          > img {
            width: 234rpx;
            height: 146rpx;
          }
        }
      }
      .sort3 {
        padding: 7rpx 22rpx;
        > image {
          width: 706rpx;
          height: 352rpx;
        }
        p {
          font-size: 36rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #000000;
          line-height: 86rpx;
          height: 86rpx;
        }
        .from {
          color: #999999;
          height: 48rpx;
          line-height: 48rpx;
          font-size: 24rpx;
          > span {
            margin-right: 21rpx;
            color: #999999;
          }
        }
      }
    }
  }
}

//空布局
.noData {
  width: 100%;
  flex: 1;
  text-align: center;
  color: #999999;
  font-size: 30rpx;
  padding-top: 40rpx;

  img {
    width: 40rpx;
    height: 40rpx;

    margin-bottom: 10rpx;
  }
}
/*加载完成布局*/
.finished {
  width: 100%;
  color: #999999;
  text-align: center;
  font-size: 30rpx;
  margin-bottom: 30rpx;
}
</style>
