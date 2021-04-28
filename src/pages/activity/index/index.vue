<template>
  <div class="home">
    <div class="main">
      <div class="top">
        <div class="one">
          <div id="imgbox">
            <img mode="widthFix" :src="activityone" alt="" />
          </div>
          <div class="one-content">
            <div class="bgimg">
              <open-data
                type="userAvatarUrl"
                mode="aspectFit"
                class="userImg"
              ></open-data>
            </div>
            <div>
              <p>{{ info.realNm }}</p>
              <p>{{ info.unit }}</p>
            </div>
          </div>
        </div>
        <div class="two">
          <swiper
            :indicator-dots="indicatordots"
            indicator-color="#ccc"
            indicator-active-color="white"
          >
            <swiper-item v-for="(item, index) in banner" :key="index">
              <img mode="widthFix" :src="item.srcUrl" alt="" />
            </swiper-item>
          </swiper>
        </div>
      </div>
      <div class="nav">
        <div class="nav-top">
          <img :src="online" alt="" />
          <p>在线学习</p>
        </div>
        <div class="nav-bottom">
          <div
            v-for="(item, index) in navList"
            :key="index"
            @click="changeActive(item, index)"
          >
            <img :src="item.src" mode="widthFix" alt="图片找不到" />
            <p :class="{ red: cd == item.id }">{{ item.nm }}</p>
            <!-- 选中后的照片 -->
            <img
              v-show="cd == item.id"
              id="selectimg"
              mode="widthFix"
              :src="selected"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="articlemain">
        <div
          class="content"
          v-for="(item, index) in list"
          :key="index"
          @click="toDetail(item)"
        >
          <div>
            <p>{{ item.nm }}</p>
            <p>{{ item.actToTm }}</p>
          </div>
          <div>
            <img mode="widthFix" v-if="cd == 2" :src="item.imgUrl" />
            <img mode="widthFix" v-else :src="item.imgCover" />
          </div>
        </div>
      </div>
    </div>
    <tab123 :tabCd="tabCd"></tab123>
  </div>
</template>

<script>
import tab123 from "../../../components/tabNew.vue";
import ceshi from "../../../../static/images/测试.jpg";
import QQMapWX from "../../../utils/libs/qqmap-wx-jssdk";
import test from "../../../../static/images/test.png";
import vote from "../../../../static/images/vote.png";
import answer from "../../../../static/images/answer.png";
import activityone from "../../../../static/images/activity-one.png";
import online from "../../../../static/images/online-study.png";
import selected from "../../../../static/images/selected.png";
export default {
  data() {
    return {
      tabCd: "activity",
      navList: [
        {
          nm: "考试",
          id: "1",
          src: test,
        },
        {
          nm: "投票",
          id: "2",
          src: vote,
        },
        {
          nm: "问卷",
          id: "3",
          src: answer,
        },
      ],
      activityone: activityone, //活动图片
      banner: [],
      online: online,
      selected: selected,
      cd: "1",
      list: [],
      pageNo: "1",
      pageSize: "10",
      total: "",
      city: "", //城市
      prov: "", //省份
      info: {},
      indicatordots: false,
    };
  },
  components: {
    tab123,
  },
  async onLoad(e) {
    // this.getRegionInfo();
  },
  onShareAppMessage(res) {},
  async onShow() {
    this.getData();
    this.getCompany();
    if (this.cd == 1) {
      this.getAnswerList();
    }
    if (this.cd == 2) {
      this.getList();
    }
    if (this.cd == 3) {
      this.getAnswerList();
    }
  },
  onPullDownRefresh() {},
  onReachBottom() {},
  methods: {
    // 获取活动页轮播图
    async getData() {
      let qry = this.query.new();
      this.query.toW(qry, "cd", "activity_banner");
      let data = await this.api.banner(this.query.toEncode(qry));
      this.banner = data.data.list;
      if (this.banner.length > 1) this.indicatordots = true;
    },
    // 获取真实姓名和归属单位
    async getCompany() {
      let data = await this.api.myCompany();
      this.info = data.data;
    },
    //获取投票列表
    async getList() {
      let qry = this.query.new();
      this.query.toP(qry, this.pageNo, this.pageSize);
      // this.query.toW(qry,'allowArea',wx.getStorageSync('city'),'EQ')
      let data = await this.api.getVoteList(
        encodeURIComponent(this.query.toJsonStr(qry))
      );
      // let data = await this.api.getVoteList(encodeURIComponent(this.query.toJsonStr(qry))+'&allowArea=' + wx.getStorageSync('city'));
      this.list = [];
      data.data.list.forEach((item) => {
        // 获取年月日不要时分秒
        item.actFrTm = item.actFrTm ? item.actFrTm.split(" ")[0] : "";
        item.actToTm = item.actToTm ? item.actToTm.split(" ")[0] : "";
      });
      this.list.push(...data.data.list);
      this.total = data.page.total;
    },
    //获取考试和问卷列表
    async getAnswerList() {
      let qry = this.query.new();
      this.query.toP(qry, this.pageNo, this.pageSize);
      if (this.cd == 1) {
        this.query.toW(qry, "type", 1, "EQ");
      } else if (this.cd == 3) {
        this.query.toW(qry, "type", 2, "EQ");
      }
      let data = await this.api.getAnswerList(
        encodeURIComponent(this.query.toJsonStr(qry))
      );
      // let data = await this.api.getAnswerList(encodeURIComponent(this.query.toJsonStr(qry))+'&allowArea=' + wx.getStorageSync('city'));
      this.list = [];
      data.data.list.forEach((item) => {
        item.actFrTm = item.actFrTm ? item.actFrTm.split(" ")[0] : "";
        item.actToTm = item.actToTm ? item.actToTm.split(" ")[0] : "";
      });
      this.list.push(...data.data.list);
      this.total = data.page.total;
    },
    changeActive(item) {
      // 修改cd，cd绑定了选中样式
      this.cd = item.id;
      this.pageNo = 1;
      this.pageSize = 10;
      // 获取内容
      if (this.cd == 1) {
        this.getAnswerList();
      } else if (this.cd == 2) {
        this.getList();
      } else if (this.cd == 3) {
        this.getAnswerList();
      }
    },
    toPage(url) {
      this.until.aHref(url);
    },
    toDetail(item) {
      if (this.cd == 1) {
        let url = "/pages/activity/answer/main?id=" + item.id;
        this.until.aHref(url);
      } else if (this.cd == 2) {
        let url = "/pages/activity/voteIndex/main?id=" + item.id;
        this.until.aHref(url);
      } else if (this.cd == 3) {
        let url = "/pages/activity/question/main?id=" + item.id;
        this.until.aHref(url);
      }
    },
    //获取用户位置信息
    //  获取用户地址
    getRegionInfo() {
      var that = this,
        qqmapsdk;
      qqmapsdk = new QQMapWX({
        key: "KXXBZ-675KF-JOAJJ-NSX2Q-HYG6H-TMFNI",
      });
      wx.getLocation({
        //获取当前地址
        type: "wgs84",
        success: function (res) {
          // console.log('location')
          // console.log(res)
          var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180
          //根据经纬度获取所在城市
          qqmapsdk.reverseGeocoder({
            location: { latitude: latitude, longitude: longitude },
            success: function (res) {
              // console.log('res')
              // console.log(res)
              //address 城市
              that.city = res.result.address_component.city;
              that.prov = res.result.address_component.province;
              wx.setStorageSync("city", that.city);
              wx.setStorageSync("province", that.prov);
              // console.log(that.city,that.prov)
              // that.getList();
            },
          });
        },
      });
    },
  },
  onUnload() {},
};
</script>

<style scoped lang="less">
.home {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  .main {
    flex: 1;
    overflow: auto;
    .top {
      .one {
        width: 100vw;
        position: relative;
        #imgbox {
          width: 100%;
          overflow: hidden;
          img {
            width: 102%;
          }
        }
        .one-content {
          display: flex;
          position: absolute;
          left: 40rpx;
          top: 52rpx;

          .bgimg {
            .userImg {
              margin: 0 auto;
              border-radius: 100%;
              object-fit: cover;
              display: block;
              overflow: hidden;
              width: 104rpx;
              height: 104rpx;
            }
          }
          div:nth-child(2) {
            display: inline-block;
            padding-left: 20rpx;
            padding-top: 10rpx;

            p:nth-child(1) {
              margin-bottom: 8rpx;
              width: 96rpx;
              height: 44rpx;
              font-size: 32rpx;
              font-family: PingFang SC;
              font-weight: 500;
              line-height: 44rpx;
              color: #ffffff;
              opacity: 1;
            }
            p:nth-child(2) {
              width: 456rpx;
              height: 34rpx;
              font-size: 24rpx;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 34rpx;
              color: #ffffff;
              opacity: 1;
            }
          }
        }
      }
      .two {
        margin-top: -65rpx;
        width: 750rpx;
        height: 336rpx;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        swiper {
          width: 100%;
          height: 100%;
          img {
            border-radius: 110rpx;
            width: 726rpx;
            height: 336rpx;
            position: absolute;
            top: -12rpx;
          }
        }
      }
    }
    .nav {
      width: 100%;
      .nav-top {
        display: flex;
        align-items: center;
        margin: 28rpx 30rpx 40rpx;
        img {
          width: 45rpx;
          height: 37rpx;
          margin-right: 15rpx;
        }
        p {
          width: 128px;
          height: 44rpx;
          font-size: 32rpx;
          font-family: PingFang SC;
          font-weight: 600;
          line-height: 44rpx;
          color: #333333;
          opacity: 1;
        }
      }
      .nav-bottom {
        display: flex;
        width: 100vw;
        height: 192rpx;
        div {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: start;
          img:nth-child(1) {
            width: 136rpx;
          }
          #selectimg {
            width: 108rpx;
            position: absolute;
            bottom: 0;
          }
          p {
            text-align: center;
            width: 56px;
            height: 40rpx;
            font-size: 28rpx;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 40rpx;
            color: #333333;
            opacity: 1;
          }
        }
      }
    }
    .articlemain {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;
      width: 100vw;
      .content {
        border-top: 1px solid #dddddd;
        opacity: 1;
        width: 690rpx;
        div:nth-child(1) {
          padding-top: 20rpx;
          padding-bottom: 28rpx;
          p:nth-child(1) {
            // width: 684rpx;
            // height: 50rpx;
            white-space: nowrap; /*内容超宽后禁止换行显示*/
            overflow: hidden; /*超出部分隐藏*/
            text-overflow: ellipsis; /*文字超出部分以省略号显示*/
            font-size: 36rpx;
            font-family: PingFang SC;
            font-weight: 600;
            line-height: 50rpx;
            color: #333333;
            opacity: 1;
          }
          p:nth-child(2) {
            // width: 162rpx;
            // height: 40rpx;
            font-size: 28rpx;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 40rpx;
            color: #999999;
            opacity: 1;
          }
        }
        div:nth-child(2) {
          img {
            width: 690rpx;
            margin-bottom: 50rpx;
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
