<template>
  <!--弹窗的页面-->
  <div class="modalMask" v-if="isModel"></div>
  <div class="modalDialog" v-if="changeModel">
    <div class="modalContent">
      <p class="contentTip">我是弹窗的页面哦~</p>
    </div>
    <div class="modalFooter">
      <div class="btnCancel" @tap="tapCancel">取消</div>
      <div class="btnConfirm" @tap="confirmSend">确定</div>
    </div>
  </div>
  <!-- //结束 -->
</template>
<script>
  export default {
    data() {
      return {
        changeModel: false,
        isModel: false,
        val: "",
      };
    },
    methods: {
      //  弹框取消
      tapCancel() {
        console.log("取消");
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      },
      //  确认
      confirmSend() {
        console.log("确认");
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;

      },
      show_pro(val) {
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      }
    }
  };
</script>
<style scoped lang="less">
  /* 弹窗开始 */
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
  }
  .contentTip {
    text-align: center;
    font-size: 36rpx;
    color: #333333;
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
</style>
