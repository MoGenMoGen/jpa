<template>
  <div class="home">
    <div class="header">
      <ul>
        <li>
          <p class="hd">任务编号</p>
          <span>|</span>
          <p class="ct">{{ info.code }}</p>
        </li>
        <li>
          <div class="left">
            <p class="hd">倒计时间</p>
            <span>|</span>
            <p class="ct">{{ info.endTime }}</p>
          </div>
          <div class="right">
            <!--          <p class="hd">截图数量</p>-->
            <!--          <span>|</span>-->
            <!--          <p class="ct">{{info.needImgNum}}张</p>-->
          </div>
        </li>
        <li>
          <div class="left">
            <p class="hd">发布人员</p>
            <span>|</span>
            <p class="ct">{{ info.applyPersRealNm }}</p>
          </div>
          <div class="right">
            <p class="hd">发布单位</p>
            <span>|</span>
            <p class="ct">{{ info.taskPlat }}</p>
          </div>
        </li>
        <li>
          <p class="hd">任务对象</p>
          <span>|</span>
          <p class="ct">
            <span v-for="(v, s) in info.zfwUnitVoList" :key="s">{{
              v.unit
            }}</span>
          </p>
        </li>
        <li>
          <p class="hd">任务来源</p>
          <span>|</span>
          <p class="ct">{{ info.taskSource }}</p>
        </li>
        <li>
          <p class="hd">任务标题</p>
          <span>|</span>
          <p class="ct">{{ info.taskTitle }}</p>
        </li>
        <!--      <li>-->
        <!--        <p class="hd">任务标签</p>-->
        <!--        <span>|</span>-->
        <!--        <p class="ct">{{info.taskTag}}</p>-->
        <!--      </li>-->
        <li>
          <p class="hd">任务内容</p>
          <span>|</span>
          <p class="red" @click="toPage('/pages/my/support/main')">
            <img src="../../../../static/task/play1.png" />观看教程
          </p>
          <p style="font-size: 28rpx; width: 100%">
            {{ info.step }}
          </p>
        </li>

        <li>
          <p class="hd">链接地址</p>
          <span>|</span>
          <div class="linkurl" :data-text="info.linkUrl">
            {{ info.linkUrl }}
            <!--(点击链接去完成任务）-->
            <div class="handlegofinish" @tap="toFinishTask">点击去完成任务</div>
          </div>
        </li>
        <li>
          <p class="hd">任务状态</p>
          <span>|</span>
          <p class="ct" v-if="cd == 1">{{ "未完成" }}</p>
          <p class="ct" v-if="cd == 2">{{ "完成" }}</p>
          <p class="ct" v-if="cd == 3" style="color: #e33637">{{ "已超时" }}</p>
          <p class="ct" v-if="cd == 4">{{ "审批通过" }}</p>
          <p class="ct" v-if="cd == 5" style="color: #e12728">{{ "已撤销" }}</p>
        </li>
        <li v-if="cd == 4">
          <p class="hd">审批意见</p>
          <span>|</span>
          <p class="ct">{{ info.noPassRmk ? info.noPassRmk : "" }}</p>
        </li>
        <li v-if="cd == 5">
          <p class="hd">撤销原因</p>
          <span>|</span>
          <p class="ct">{{ info.backoutRmk ? info.backoutRmk : "" }}</p>
        </li>
        <li v-if="cd == 5">
          <p class="hd">撤销时间</p>
          <span>|</span>
          <p class="ct">{{ info.backoutTm ? info.backoutTm : "" }}</p>
        </li>
        <!--      <li style="height: 220rpx;" v-if="cd==2">-->
        <!--        <image class="need" mode="aspectFill" v-for="(i,index) in img" :key="index" :src="i" @click="toLook(i)"/>-->
        <!--      </li>-->
        <li v-if="cd == 2">
          <p class="hd">完成时间</p>
          <span>|</span>
          <p class="ct">{{ info.finishTm ? info.finishTm : "" }}</p>
        </li>
        <!--提交内容-->
        <!--      <li v-if="cd == 1" style="border-bottom: none;">-->
        <!--        <div class="input">-->
        <!--          <img src="../../../../static/task/pen.png"/>-->
        <!--          <textarea v-model="postInfo.rmks" placeholder="请输入提交内容上传截图以证明完成任务"></textarea>-->
        <!--        </div>-->
        <!--      </li>-->
        <!--      &lt;!&ndash;上传截图&ndash;&gt;-->
        <!--      <li v-if="cd == 1" style="border-bottom: none;">-->
        <!--        <div class="upload">-->
        <!--          <img style="margin-right: 20rpx;" :src="posImgUrl" mode="aspectFit" @click="toPhoto()"/>-->
        <!--          <div  v-for="(item,index) in image" :key="index">-->
        <!--            <image class="img" mode="aspectFill" :src="item" @click="toLook(item)"/>-->
        <!--            <img class="del" src="../../../../static/task/delete.png" @click="del(item,index)">-->
        <!--          </div>-->
        <!--        </div>-->
        <!--      </li>-->
      </ul>
    </div>

    <div class="foot" v-if="cd == 4">
      <button @click="show_pro2()">撤销</button>
    </div>
    <!--  <div class="foot" v-if="cd==1">-->
    <!--    <button @click="show_pro()">提交</button>-->
    <!--  </div>-->

    <!--  <div class="modalMask" v-if="isModel"></div>-->
    <!--  <div class="modalDialog" v-if="changeModel">-->
    <!--    <div class="modalContent" >-->
    <!--      <p class="title" v-if="cd==1">提示</p>-->
    <!--      <p>您还未上传截图</p>-->
    <!--    </div>-->
    <!--    <div class="modalFooter">-->
    <!--      <div class="btnCancel" @tap="tapCancel">取消</div>-->
    <!--      <div class="btnConfirm" @tap="confirmSend">确定</div>-->
    <!--    </div>-->
    <!--  </div>-->

    <div class="modalMask" v-if="isModel2"></div>
    <div class="modalDialog" v-if="changeModel2">
      <div class="modalContent2">
        <p class="title">撤销任务</p>
        <p class="miniRed">确认撤销此任务吗？</p>
        <textarea
          v-model="backInfo.backoutRmk"
          placeholder="请输入撤销原因"
        ></textarea>
      </div>
      <div class="modalFooter">
        <div class="btnCancel" @tap="tapCancel2">取消</div>
        <div class="btnConfirm" @tap="confirmSend2">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
      type: 0,
      changeModel: false,
      isModel: false,
      changeModel2: false,
      isModel2: false,
      cd: "",
      id: "",
      info: {}, //任务详情
      img: [], //截图数组
      postInfo: {
        needImg: "",
        rmks: "",
        taskId: "",
      },
      backInfo: {
        backoutRmk: "", //撤销原因
        id: "",
      },
      image: [],
      posImgUrl:
        "http://oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/pfyf/d7a30f5f00fa4efd846f499b47ea43fd.png",
    };
  },
  onLoad(options) {
    this.image = [];
    this.cd = options.cd;
    this.id = options.id;
    console.log(this.cd, this.id);
    if (this.cd == 4 || this.cd == 5) {
      this.getSHTaskDetail();
    } else {
      this.getMyTaskDetail();
    }
  },
  onUnload() {},
  onShareAppMessage(option) {
    return {
      title: "任务详情",
      desc: "任务详情",
      path: "/pages/task/detail/main?id=" + this.id + "&cd=" + this.cd,
    };
  },
  onShow() {},
  methods: {
    toFinishTask(e) {
      if (
        !this.zfwTaskPersLinkVoId &&
        this.until.TimeStep(this.info.endTm) > 0
      ) {
        wx.showToast({
          title: "已经过了截止时间", // 标题
          icon: "none", // 图标类型，默认success
          duration: 1500, // 提示窗停留时间，默认1500ms
        });
        return;
      }
      this.postInfo.taskId = this.info.id;
      if (this.info.taskPlat == "微信") {
        let url =
          "/pages/wxDetail/main?url=" +
          encodeURIComponent(this.info.linkUrl) +
          "&postInfo=" +
          JSON.stringify(this.postInfo);
        wx.redirectTo({ url });
      }
      // if(this.info.taskPlat=='抖音'){
      //   this.api.copyText(e)
      // }
    },
    toPage(url) {
      this.until.aHref(url);
    },
    //上传图片
    async toPhoto() {
      let imgUrl = await this.api.chooseImages();
      for (let i = 0; i < imgUrl.length; i++) {
        let img = await this.api.upLoad(imgUrl[i]);
        this.image.push(img);
      }
    },
    //删除当前选中图片
    del(e, index) {
      this.image.splice(index, 1);
      return this.image;
    },
    //预览当前图片
    toLook(e) {
      let data = [];
      data.push(e);
      wx.previewImage({
        current: e, // 当前显示图片的http链接
        urls: data, // 需要预览的图片http链接列表
      });
    },
    //查询审批任务详情
    async getSHTaskDetail() {
      let data = await this.api.SHTaskDetail(this.id);
      this.info = data;
      let time = this.until.CountDown(this.info.endTm);
      let d = Number(time.day);
      let h = Number(time.h);
      let m = Number(time.m);
      let endTime = "剩" + d + "天" + h + "时" + m + "分";
      this.$set(this.info, "endTime", endTime);
      this.img = this.info.needImg.split(",");
    },
    //查询我的任务详情
    async getMyTaskDetail() {
      let data = await this.api.myTask(this.id);
      this.info = data.data;
      let time = this.until.CountDown(this.info.endTm);
      let d = Number(time.day);
      let h = Number(time.h);
      let m = Number(time.m);
      let endTime = "剩" + d + "天" + h + "时" + m + "分";
      this.$set(this.info, "endTime", endTime);
      this.img = this.info.needImg.split(",");
    },
    tapCancel() {
      this.changeModel = !this.changeModel;
      this.isModel = !this.isModel;
    },
    //  确认
    confirmSend() {
      this.changeModel = !this.changeModel;
      this.isModel = !this.isModel;
    },
    //打开弹窗
    show_pro(type) {
      this.postInfo.needImg = this.image.join(",");
      if (!this.postInfo.needImg) {
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
        return;
      }
      if (this.image.length < this.info.needImgNum) {
        wx.showToast({
          title: "截图数量小于要求的截图数量", // 标题
          icon: "none", // 图标类型，默认success
          duration: 1500, // 提示窗停留时间，默认1500ms
        });
        return;
      }

      console.log(this.until.TimeStep(this.info.endTm));
      if (
        !this.zfwTaskPersLinkVoId &&
        this.until.TimeStep(this.info.endTm) > 0
      ) {
        wx.showToast({
          title: "已经过了截止时间", // 标题
          icon: "none", // 图标类型，默认success
          duration: 1500, // 提示窗停留时间，默认1500ms
        });
        return;
      }
      this.postInfo.taskId = this.info.id;
      console.log("this.postInfo", this.postInfo);
      this.api.taskPersLink(JSON.stringify(this.postInfo)).then((res) => {
        if (res.msg == 0) {
          wx.showToast({
            title: "已提交成功！", // 标题
            icon: "success", // 图标类型，默认success
            duration: 1500, // 提示窗停留时间，默认1500ms
          });
        }
        setTimeout(() => {
          this.until.back();
        }, 1000);
      });
    },
    //打开弹窗
    show_pro2(type) {
      this.changeModel2 = !this.changeModel2;
      this.isModel2 = !this.isModel2;
    },
    tapCancel2() {
      this.changeModel2 = !this.changeModel2;
      this.isModel2 = !this.isModel2;
    },
    //  确认
    confirmSend2() {
      this.backInfo.id = this.info.id;
      this.api.SHTackExamCancel(this.backInfo).then((res) => {
        wx.showToast({
          title: "已撤销成功！", // 标题
          icon: "success", // 图标类型，默认success
          duration: 1500, // 提示窗停留时间，默认1500ms
        });
        setTimeout(() => {
          this.until.back();
        }, 1000);
      });
      this.changeModel2 = !this.changeModel2;
      this.isModel2 = !this.isModel2;
    },
  },
};
</script>
<style scoped lang="less">
.home {
  min-height: 100vh;
  width: 100vw;
  background-color: rgba(245, 245, 245, 0.58);
  padding: 10rpx 20rpx;
  box-sizing: border-box;
  .header {
    background-color: #ffffff;
    border-radius: 10rpx;
    width: 710rpx;
    margin-bottom: 40rpx;
    ul {
      display: flex;
      flex-direction: column;
    }
    ul li {
      display: flex;
      align-items: center;
      padding: 30rpx 25rpx;
      border-bottom: 1rpx solid #e6e6e6;
      &:nth-child(7) {
        display: flex;
        flex-wrap: wrap;
        .hd {
          display: flex;
          align-items: center;
        }
        .red {
          display: flex;
          align-items: center;
          color: #e22829;
          flex: 1;
          > img {
            width: 26rpx;
            height: 26rpx;
            margin-right: 6rpx;
          }
        }
      }
      &:nth-child(8) {
        display: flex;
        align-items: normal;
        padding-top: 38rpx;
        p:nth-child(1) {
          float: left;
        }
        span {
          /*float: left;*/
        }
        .linkurl {
          display: flex;
          flex-direction: column;
          justify-items: center;
          width: 484rpx;
          float: right;
          font-size: 28rpx;
          line-height: 45rpx;
          word-break: break-all;
          .handlegofinish {
            width: 263rpx;
            height: 52rpx;
            background-color: #e22829;
            box-shadow: 0px 4rpx 5rpx 0px rgba(110, 110, 110, 0.18);
            border-radius: 26rpx;
            font-size: 30rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            line-height: 52rpx;
          }
        }
      }
      .need {
        width: 74rpx;
        height: 162rpx;
        padding: 40rpx 15rpx;
      }
      .left {
        display: flex;
        float: left;
        width: 400rpx;
        > span {
          color: #bbcbe7;
          margin: 0 20rpx;
        }
        .rt {
          flex: 1;
        }
      }
      .right {
        display: flex;
        float: right;
        flex: 1;
        > span {
          color: #bbcbe7;
          margin: 0 20rpx;
        }
        .rt {
          flex: 1;
        }
      }
      .hd {
        width: 120rpx;
        font-size: 30rpx;
        color: #303030;
        font-weight: bold;
      }
      .ct {
        flex: 1;
        color: #303030;
        font-size: 28rpx;
      }
      > span {
        color: #bbcbe7;
        margin: 0 20rpx;
      }
      .input {
        display: flex;
        align-items: center;
        img {
          padding-left: 35rpx;
          width: 27rpx;
          height: 27rpx;
          margin-right: 19rpx;
        }
        > textarea {
          height: 110rpx;
          padding-top: 65rpx;
          flex: 1;
        }
      }
      .upload {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        flex: 1;
        img {
          width: 100rpx;
          height: 100rpx;
        }
        > div {
          width: 125rpx;
          height: 190rpx;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          .img {
            width: 74rpx;
            height: 162rpx;
            object-fit: cover;
          }
          .del {
            position: absolute;
            right: 0;
            top: 0;
            width: 47rpx;
            height: 47rpx;
          }
        }
      }
    }
  }

  .foot {
    width: 710rpx;
    margin-top: 30rpx;
    margin-bottom: 54rpx;
    button {
      background-color: #74a8ff;
      color: #ffffff;
      font-size: 30rpx;
      border: none;
      border-radius: 40rpx;
      height: 82rpx;
    }
  }

  .remind {
    color: #ef5b5c;
    margin-top: 20rpx;
    font-size: 24rpx;
  }

  .modalMask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.5;
    overflow: hidden;
    z-index: 9000;
    color: #fff;
  }
  .modalDialog {
    box-sizing: border-box;
    width: 560rpx;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 0;
    z-index: 9999;
    background: #fff;
    margin: -180rpx 95rpx;
    border-radius: 8rpx;
  }
  .modalContent {
    box-sizing: border-box;
    display: flex;
    padding: 50rpx 53rpx;
    font-size: 32rpx;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    p {
      height: 60rpx;
    }
  }
  .modalContent2 {
    box-sizing: border-box;
    display: flex;
    padding: 50rpx 53rpx;
    font-size: 32rpx;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .miniRed {
      color: #e33637;
      font-size: 18rpx;
    }
    textarea {
      width: 500rpx;
      height: 220rpx;
      background-color: #f7f7f7;
    }
  }
  .title {
    font-size: 30rpx;
    text-align: center;
    color: #121214;
    margin-bottom: 5rpx;
  }
  .remind {
    color: #ef5b5c;
    margin-top: 20rpx;
    font-size: 28rpx;
  }
  .teleStyle {
    background: #ffffff;
    border: 1px solid #979797;
    border-radius: 6rpx;
    line-height: 50rpx;
    height: 50rpx;
    box-sizing: border-box;
    padding-left: 12rpx;
    width: 460rpx;
    font-size: 28rpx;
    /*color: rgba(0,0,0,0.25);*/
    margin-top: 30px;
  }
  .modalFooter {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 100rpx;
    border-top: 1px solid #e5e5e5;
    font-size: 32rpx;
    line-height: 100rpx;
  }
  .btnCancel {
    width: 50%;
    font-size: 32rpx;
    color: #333;
    text-align: center;
    border-right: 1px solid #e5e5e5;
  }
  .btnConfirm {
    font-size: 32rpx;
    width: 50%;
    color: #508cee;
    text-align: center;
  }
  /* 弹窗结束 */
}
</style>
