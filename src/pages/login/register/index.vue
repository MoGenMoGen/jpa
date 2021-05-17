<template>
  <div class="home">
    <div class="container">
      <p class="title">{{ titleName }}</p>
      <ul class="list">
        <li>
          <span>手机号码</span><span>|</span
          ><input
            v-model="info.mob"
            type="number"
            maxlength="11"
            placeholder="请输入手机号码"
          />
        </li>
        <li>
          <span>真实姓名</span><span>|</span
          ><input
            v-model="info.realNm"
            type="text"
            placeholder="请输入真实姓名"
          />
        </li>
        <li>
          <span>登录密码</span><span>|</span
          ><input
            v-model="info.password"
            type="password"
            placeholder="请输入登录密码（6位以上的数字或字母）"
          />
        </li>
        <li>
          <span>确认密码</span><span>|</span
          ><input
            v-model="password"
            type="password"
            placeholder="请再次输入登录密码"
          />
        </li>
        <li>
          <span>归属单位</span><span>|</span>
          <div class="mutilSelector">
            <picker
              mode="multiSelector"
              @columnchange="changeNextCol"
              :value="mulIndex"
              :range="mulArr"
            >
              <view class="picker">
                {{ mulArr[0][mulIndex[0]] }}-{{ mulArr[1][mulIndex[1]] }}-{{
                  mulArr[2][mulIndex[2]]
                }}
              </view>
            </picker>
          </div>
        </li>
      </ul>
      <button @tap="register" class="btn">注册</button>
    </div>
    <span @tap="toPage('/pages/login/index/main')" class="tologin">登录</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        mob: "",
        password: "",
        realNm: "",
      },
      password: "",
      titleName: "政法融媒体矩阵管控平台", //标题名称
      mulIndex: [0, 0, 0],
      mulArr: [],
      // 假设json为后端返回的数据
      json: [
        {
          type: "汽车",
          brand: [
            { name: "领克", cars: ["01", "02", "03"] },
            { name: "丰田", cars: ["汉兰达", "凯美瑞", "卡罗拉"] },
          ],
        },
        {
          type: "摩托车",
          brand: [
            { name: "雅马哈", cars: ["MT-9", "迅鹰"] },
            { name: "铃木", cars: ["钻豹", "gw250"] },
          ],
        },
        {
          type: "自行车",
          brand: [
            { name: "美利达", cars: ["挑战者300", "挑战者900"] },
            { name: "捷安特", cars: ["ATX777", "XTR"] },
          ],
        },
      ],
    };
  },
  // 由于 mulArr中没有数据，页面加载后是没有选项的，所以需要在onLoad是给mulArr加入数据
  onLoad() {
    this.info = {};
    // 初始化picker默认值
    this.mulArr[0] = this.json.map(function (v) {
      return v.type;
    });
    this.mulArr[1] = this.json[this.mulIndex[0]].brand.map(function (v) {
      return v.name;
    });
    this.mulArr[2] = this.json[this.mulIndex[0]].brand[this.mulIndex[1]].cars;
  },
  async onShow() {
    this.getxmmc();
    this.getAttributionunit(encodeURIComponent({}))

  },
  onShareAppMessage(res) {
    return {
      title: "注册",
      desc: "注册",
      path: "/pages/login/register/main",
    };
  },
  methods: {
    //  关键的地方在于监听用户对列的改变   changeNextCol 函数
    changeNextCol(e) {
      // 列的值改变时触发   我这里是三列：车子类型  品牌名称  车型
      console.log("修改的列", e.target.column, "值为", e.target.value);
      // 监听用户操作，改变mulIndex的值
      this.mulIndex[e.target.column] = e.target.value;
      // mulArr[0]的值是不会随用户操作变更的，因此不需要改变
      // mulArr[1]的值是由 mulIndex[0]的值决定的
      this.mulArr.splice(
        1,
        1,
        this.json[this.mulIndex[0]].brand.map(function (v) {
          return v.name;
        })
      );
      // mulArr[2]的值是由 muIndex[1]的值决定的
      this.mulArr.splice(
        2,
        1,
        this.json[this.mulIndex[0]].brand[this.mulIndex[1]].cars
      );
    },
    async getxmmc() {
      let data = await this.api.xmmc();
      this.titleName = data;
    },
    //获取归属单位
    async getAttributionunit(parms){
      let data=await this.api.Attributionunit(parms)
      console.log("归属单位",data);
    },
    register() {
      let news = this.reg.checkPhone(Number(this.info.mob));
      if (news != "ok") {
        wx.showToast({
          title: news, // 标题
          icon: "none", // 图标类型，默认success
          duration: 1000, // 提示窗停留时间，默认1500ms
        });
      } else {
        if (this.password != this.info.password) {
          wx.showToast({
            title: "两次密码不相同！", // 标题
            icon: "none", // 图标类型，默认success
            duration: 1000, // 提示窗停留时间，默认1500ms
          });
        } else {
          this.api.register(this.info).then((res) => {
            if (res.code == 0) {
              if (!wx.getStorageSync("yui3-token")) {
                let data = res.data.token;
                let userInfo = res.data.userInfo;
                wx.setStorageSync("yui3-token", data);
                wx.setStorageSync("userInfo", userInfo);
              }
              wx.showToast({
                title: "注册成功！", // 标题
                icon: "success", // 图标类型，默认success
                duration: 1500, // 提示窗停留时间，默认1500ms
              });
              setTimeout(() => {
                this.toLogin("/pages/login/index/main");
              }, 1000);
            } else {
              wx.showToast({
                title: res.msg,
              });
            }
          });
        }
      }
    },
    toPage(url) {
      this.until.aHref(url);
    },
    changeActive(e) {
      this.cd = e.cd;
    },
    //跳转至登录页面
    toLogin(url) {
      wx.reLaunch({ url });
    },
  },
};
</script>
<style scoped lang="less">
* {
  box-sizing: border-box;
}
.home {
  width: 100vw;
  height: 100vh;
  background-image: url("
http://jiapingan.oss-cn-hangzhou.aliyuncs.com/b8891568dde74452bf5f836d635266f6.png");
  background-repeat: no-repeat;
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 26rpx;
    .title {
      width: 539rpx;
      height: 46rpx;
      font-size: 48rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #ffffff;
      line-height: 30rpx;
      margin-top: 108rpx;
      margin-bottom: 160rpx;
      text-align: center;
    }
    .list {
      width: 670rpx;
      height: 528rpx;
      background: #ffffff;
      border-radius: 20rpx;
      display: flex;
      flex-direction: column;
      li {
        width: 100%;
        display: flex;
        align-items: center;
        flex: 1;
        border-bottom: 1px solid #cdcdcd;
        span:nth-child(1) {
          padding-left: 30rpx;
          padding-right: 20rpx;
          width: 120rpx;
          height: 104rpx;
          font-size: 30rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #303030;
          line-height: 104rpx;
        }
        span:nth-child(2) {
          width: 1rpx;
          height: 104rpx;
          padding-right: 19rpx;
          line-height: 104rpx;
          color: #cecece;
        }
        input {
          flex: 1;
          font-size: 24rpx;
          font-family: PingFang SC;
          font-weight: 400;
          color: #b3b3b3;
          height: 104rpx;
          line-height: 104rpx;
        }
      }
      li:nth-child(5) {
        border-bottom: 0px;
        .mutilSelector {
          flex: 1;
          height: 104rpx;
          line-height: 104rpx;
          background-image: url("
http://jiapingan.oss-cn-hangzhou.aliyuncs.com/23f047c5c6714cc58913a754e5042793.png");
          background-repeat: no-repeat;
          background-size: 35rpx 18rpx;
          background-position: 390rpx center;
          .picker {
            height: 104rpx;
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #303030;
            width: 481rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .btn {
      margin-top: 61rpx;
      width: 610rpx;
      height: 82rpx;
      background: #e43233;
      border-radius: 40rpx;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 82rpx;
    }
  }
  .tologin {
    font-size: 30rpx;
    color: #606060;
    padding-left: 620rpx;
    width: 57rpx;
    height: 28rpx;
    line-height: 28rpx;
  }
}
</style>
