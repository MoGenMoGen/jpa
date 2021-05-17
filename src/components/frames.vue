<template>
  <div
    class="app"
    :style="{ paddingTop: statusBarHeight + 'px', height: navHeight + 'px' }"
  >
    <div
      class="headArea"
      :style="{
        height: headAreaHeight + 'px',
        marginTop: headAreaMarTop + 'px',
      }"
    >
      <div class="leftBox">
        <span>
          <img mode="widthFix" src="../../static/my/myaddr2.png" alt="" />
          {{ listCity }}
          <!-- <img
            v-if="type == true"
            src="../../static/images/dropdown1.png" /><img
            v-else
            src="../../static/images/dropdown.png"
        /> -->
        </span>
        <p>{{ titleName }}</p>
        <!--        <p>平安鼎</p>-->
      </div>
      <div class="rightBox" :style="{ width: 10 + 'px' }"></div>
    </div>

    <!-- 弹窗 -->
    <div class="modalMask" v-if="isModel" @click="close()"></div>
    <div
      class="modalDialog"
      v-if="changeModel"
      :style="{ top: statusBarHeight + navHeight + 'px' }"
    >
      <div class="modalContent">
        <p
          class="text"
          v-for="(item, index) in list"
          :key="index"
        >
          <img
            v-if="item.choose == false"
            src="../../static/images/Blankbox.png"
          />
          <img v-else src="../../static/images/yesOk.png" />
          {{ item.nm }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      titleName: "嘉兴市政法平安宣传矩阵", //页面名称
      pixelRatio: "",
      statusBarHeight: "", //系统状态栏高度
      navHeight: "", //顶部导航栏高度
      headAreaHeight: "", //顶部内容区域高度
      headAreaMarTop: "", //顶部内容区域外边距
      headleftBoxW: "", //顶部内容左侧区域外边距
      headRightBoxW: "", //顶部内容右侧区域外边距
      containersHeight: "", //页面内容区域高度
      info: {},
      changeModel: false,
      isModel: false,
      type: false,
      choose: false,
      listCity: "",
      list: [],
      list2: [],
    };
  },
  onReady: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.info = res;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.pixelRatio = res.pixelRatio;
        let statusBarHeight = res.statusBarHeight;
        this.statusBarHeight = statusBarHeight;
        this.headAreaHeight = (res.pixelRatio * 42) / res.pixelRatio;
        this.headAreaMarTop = res.headAreaMarTop;
        this.headleftBoxW = res.headleftBoxW;
        this.headRightBoxW = res.headRightBoxW;
        this.containersHeight = res.containersHeight;
        let navTop = custom.top;
        // let navHeight = statusBarHeight + custom.height + (custom.top - statusBarHeight) * 2;
        let navHeight = (this.pixelRatio * 45) / this.pixelRatio;
        this.navHeight = navHeight; //导航高度
        this.StatusBar = navTop; //胶囊按钮与顶部的距离
        this.CustomBar =
          custom.bottom + custom.top - statusBarHeight; /**导航栏高度 */
        this.windowHeight = res.windowHeight; //屏幕高度
      },
    });
    if (this.info.system.substring(0, 3) == "iOS") {
      this.navHeight = (this.pixelRatio * 45) / this.pixelRatio;
      this.headAreaMarTop = (this.pixelRatio * 0.5) / this.pixelRatio;
      this.headleftBoxW =
        this.info.windowWidth - (this.pixelRatio * 100) / this.pixelRatio;
      this.headRightBoxW = (this.pixelRatio * 100) / this.pixelRatio;
      this.containersHeight =
        this.info.windowHeight -
        (this.statusBarHeight + (this.pixelRatio * 40) / this.pixelRatio);
    } else {
      this.navHeight = (this.pixelRatio * 45) / this.pixelRatio;
      this.headAreaMarTop = (this.pixelRatio * 2.5) / this.pixelRatio;
      this.headleftBoxW =
        this.info.windowWidth - (this.pixelRatio * 110) / this.pixelRatio;
      this.headRightBoxW = (this.pixelRatio * 110) / this.pixelRatio;
      this.containersHeight =
        this.info.windowHeight -
        (this.statusBarHeight + (this.pixelRatio * 45) / this.pixelRatio);
    }
  },

  async mounted() {
    this.getData();
    this.getxmmc();
  },
  async onShow() {
    this.getData();
  },
  methods: {
    async getData() {
      if (!wx.getStorageSync("userInfo").nm)
      {
        this.listCity = "嘉兴市";
        console.log("nm",wx.getStorageSync("userInfo").nm);
      }
      
      else 
      {
      this.listCity = wx.getStorageSync("userInfo").nm;
      console.log("else",wx.getStorageSync("userInfo").nm);
      }
      // let qry = this.query.new();
      // this.query.toO(qry, "sort", "asc");
      // let data = await this.api.getNewsCity(
      //   encodeURIComponent(this.query.toJsonStr(qry))
      // );
      // console.log("getdata", data);
      // this.list = data;
      // this.list.forEach((item) => {
      //   this.$set(item, "choose", true);
      // });
      // if (!wx.getStorageSync("userInfo").unitAddrCd) {
      //   this.list.forEach((item) => {
      //     item.choose = true;
      //     if (item.pidId == 0) {
      //       this.listCity = item.nm;
      //     }
      //   });
      // } else {
      //   this.list.forEach((item) => {
      //     if (wx.getStorageSync("userInfo").unitAddrCd == item.addrCd) {
      //       item.choose = true;
      //       this.listCity = item.nm;
      //     } else {
      //       item.choose = false;
      //       if (item.pidId == 0) {
      //         this.listCity = item.nm;
      //       }
      //     }
      //   });
      //   this.list2 = [];
      //   this.list2.push(wx.getStorageSync("userInfo").unitAddrCd);
      //   this.$emit("select", this.list2);
      // }
    },
    async getxmmc() {
      let data = await this.api.xmmc();
      this.titleName = data;
    },
    select(val) {
      this.list2 = [];
      this.list.forEach((item) => {
        item.choose = false;
      });
      val.choose = !val.choose;
      this.listCity = val.nm;
      this.changeModel = !this.changeModel;
      this.isModel = !this.isModel;
      this.type = !this.type;
      this.list2.push(val.addrCd);
      this.$emit("select", this.list2);
    },
    show_pro(val) {
      this.list2 = [];
      this.type = !this.type;
      this.changeModel = !this.changeModel;
      this.isModel = !this.isModel;
      console.log(this.type);
    },
    close() {
      this.changeModel = !this.changeModel;
      this.isModel = !this.isModel;
      this.type = !this.type;
      // this.list.forEach(item=>{
      //   if(item.choose == true){
      //     this.list2.push(item.addrCd)
      //   }
      // })
      // this.$emit('select',this.list2);
    },
  },
};
</script>

<style lang="less" scoped>
.app {
  background-color: #e22829;
}
.headArea {
  width: 100%;
  background-color: #e22829;
}
.leftBox {
  height: 100%;
  display: flex;
  align-items: center;
  flex: 1;
  text-align: center;
  > p {
    color: #ffffff;
    font-size: 30rpx;
    /*padding-left: 30rpx;*/
    width: 50vw;
    text-align: center;
  }
  > span {
    margin-top: -1rpx;
    color: #ffffff;
    width: 22vw;
    font-size: 30rpx;
    padding-left: 20rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    > img {
      width: 30rpx;
      margin-right: 7rpx;
    }
  }
}
.rightBox {
  width: 20vw;
  height: 100%;
  float: right;
}
/* 弹窗开始 */
.modalMask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 9000;
  color: #fff;
}
.modalDialog {
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.8);
  width: 240rpx;
  overflow: hidden;
  position: fixed;
  left: 0;
  z-index: 99999;
  border-radius: 8rpx;
}
.modalContent {
  box-sizing: border-box;
  display: flex;
  padding: 29rpx 41rpx;
  font-size: 32rpx;
  flex-direction: column;
}
.text {
  font-size: 30rpx;
  display: flex;
  align-items: center;
  height: 60rpx;
  color: #ffffff;
  > img {
    width: 30rpx;
    height: 30rpx;
    margin-right: 19rpx;
  }
}

/* 弹窗结束 */
</style>
