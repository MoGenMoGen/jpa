<template>
  <div class="home">
    <p class="title">{{ titleName }}</p>
    <!--  <p class="title">平安鼎</p>-->
    <div class="form">
      <div class="input">
        <span>手机号码</span><span class="line">|</span
        ><input
          type="number"
          v-model="info.username"
          maxlength="11"
          placeholder="请输入手机号码"
        />
      </div>
      <div class="input">
        <span>密码</span><span class="line">|</span
        ><input
          type="password"
          v-model="info.password"
          placeholder="请输入密码"
        />
      </div>
      <button @click="login">登录</button>
    </div>
    <span class="toRegistered" @click="toRegister('/pages/login/register/main')"
      >注册</span
    >
    <official-account></official-account>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        username: "",
        password: "",
        rememberMe: true,
      },
      cz: "",
      titleName: "嘉平安", //页面名称
    };
  },
  onUnload() {
    this.info = {};
  },
  onShareAppMessage(res) {
    return {
      title: "注册登录",
      desc: "注册登录",
      path: "/pages/login/index/main",
    };
  },
  async onShow() {
    this.getCz();
    this.getxmmc();
  },
  methods: {
    toPage(url) {
      this.until.aHref(url);
    },
    async getxmmc() {
      let data = await this.api.xmmc();
      this.titleName = data;
    },
    //跳转至注册页面
    toRegister(url) {
      wx.reLaunch({ url });
    },
    changeActive(e) {
      this.cd = e.cd;
    },
    //判断任务首页还是登录页
    async getCz() {
      this.cz = await this.api.dhcz();
    },
    login() {
      let news = this.reg.checkPhone(Number(this.info.username));
      if (news != "ok") {
        wx.showToast({
          title: news, // 标题
          icon: "none", // 图标类型，默认success
          duration: 1000, // 提示窗停留时间，默认1500ms
        });
      } else {
        let that = this;
        wx.login({
          success(res) {
            console.log("登录成功");
            if (res.code) {
              that.info.code = res.code;
              that.api.login(that.info).then((res) => {
                if (res.code == 0) {
                  let data = res.data.token;
                  wx.setStorageSync("yui3-token", data);
                  console.log(res.data.userInfo.subId);
                  that.api.myCompany(res.data.userInfo.subId).then((data) => {
                    wx.showToast({
                      title: "登录成功！", // 标题
                      icon: "success", // 图标类型，默认success
                      duration: 1500, // 提示窗停留时间，默认1500ms
                    });
                    if (!data.data.unitId) {
                      console.log("需要提示");
                      wx.setStorageSync("ifShow", "1");
                    }
                    setTimeout(() => {
                      // wx.switchTab({
                      // wx.reLaunch({
                      //   url: '/pages/index/main'
                      // })
                      if (that.cz == "true") {
                        let url = "/pages/index/main";
                        wx.reLaunch({ url });
                      } else {
                        // let url = '/pages/task/index/main' //跳转至任务页
                        let url = "/pages/index/main";
                        wx.reLaunch({ url });
                      }
                    }, 1000);
                  });
                } else {
                  wx.showToast({
                    title: res.msg,
                  });
                }
              });
            }
          },
        });
      }
    },
  },
};
</script>
<style scoped lang="less">
.home {
  /*height: 100vh;*/
  width: 100vw;
  background-image: url("
http://jiapingan.oss-cn-hangzhou.aliyuncs.com/b8891568dde74452bf5f836d635266f6.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .title {
    width: 100%;
    font-size: 48rpx;
    text-align: center;
    padding-top: 105rpx;
    color: #ffffff;
    margin-bottom: 161rpx;
  }
  .toRegistered {
    font-size: 30rpx;
    color: #606060;
    padding-left: 620rpx;
  }
  .form {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    margin: 0 40rpx 40rpx 40rpx;
    height: 409rpx;
    border-radius: 20rpx;
    padding: 0 30rpx;
    .input {
      display: flex;
      height: 110rpx;
      border-bottom: 2rpx solid #cdcdcd;
      > span {
        font-size: 30rpx;
        line-height: 110rpx;
        height: 110rpx;
        width: 120rpx;
      }
      > input {
        height: 110rpx;
        line-height: 110rpx;
        width: 400rpx;
      }
      .line {
        margin: 0 20rpx;
        width: fit-content;
        color: #cecece;
      }
    }
    button {
      margin-top: 61rpx;
      width: 100%;
      background-color: #e75152;
      color: #ffffff;
      border-radius: 40rpx;
    }
  }
}
</style>
