<template>
<div class="home">
<!--  <div class="noAuthorize" v-if="info.nickname">-->
<!--    <div class="main">-->
<!--      <p>注册前需微信授权，<br/>获取您的昵称头像用于个人中心展示</p>-->
<!--      <button plain="true" open-type="getUserInfo" @getuserinfo="loginBtnClick">微信登录</button>-->
<!--    </div>-->
<!--  </div>-->
  <div class="main">
    <div class="header">
      <open-data type="userAvatarUrl"  class="userImg"></open-data>
    </div>
    <!--分割线-->
    <div class="line"></div>
    <div class="table">
      <ul>
        <li>
          <img src="../../../../static/my/call.png"/>
          <div>
            <p>微信昵称<span></span></p><span>：</span>
            <open-data type="userNickName" class="userName"></open-data>
          </div>
        </li>
        <li>
          <img src="../../../../static/my/phone.png"/>
          <div>
            <p>手机号码<span></span></p><span>：</span>
            <span class="ct">{{info.mob}}</span>
          </div>
        </li>
        <li >
          <img src="../../../../static/my/realname.png"/>
          <div>
            <p>真实姓名<span></span></p><span>：</span>
            <span class="ct">{{info.realNm}}</span>
          </div>
        </li>
        <li @click="toPage('/pages/my/myInfo/main')">
          <img src="../../../../static/my/gender.png"/>
          <div>
            <p>性别<span></span></p><span>：</span>
            <span class="ct">{{info.sex ? info.sex : ''}}</span>
            <img src="../../../../static/my/line.png"/>
          </div>
        </li>
        <li @click="toPageUnit()">
          <img src="../../../../static/my/company.png"/>
          <div>
            <p>归属单位<span></span></p><span>：</span>
            <span class="ct">{{info.unit ? info.unit : ''}}</span>
            <img src="../../../../static/my/line.png"/>
          </div>
        </li>
        <li @click="toPageUnit()">
          <img src="../../../../static/my/position.png"/>
          <div>
            <p>职务名称<span></span></p><span>：</span>
            <span class="ct">{{info.post ? info.post : ''}}</span>
            <img src="../../../../static/my/line.png"/>
          </div>
        </li>
        <li style="border-bottom: none;">
          <img src="../../../../static/my/state.png"/>
          <div>
            <p>状态<span></span></p><span>：</span>
            <span class="ct">{{status}}</span>
          </div>
        </li>
      </ul>
    </div>
    <!--分割线-->
    <!--发布任务 addTask 发布任务身份 auditTask 审核任务身份-->
    <div class="line" v-if="permission.addTask || permission.auditTask"></div>
    <div class="table" v-if="permission.addTask || permission.auditTask">
      <ul>
        <li v-if="permission.addTask" @click="toPage('/pages/task/publish/main')">
          <img src="../../../../static/my/publishtask.png"/>
          <div>
            <p>发布任务<span></span></p><span></span>
            <span class="ct"></span>
            <img src="../../../../static/my/line.png"/>
          </div>
        </li>
        <li  v-if="permission.auditTask" @click="toPage('/pages/task/approve/main')">
          <img src="../../../../static/my/audittask.png"/>
          <div>
            <p>审核任务<span></span></p><span></span>
            <span class="ct"></span>
            <img src="../../../../static/my/line.png"/>
          </div>
        </li>
      </ul>
    </div>
    <div class="line" v-if="integral==0"></div>
    <div class="table" v-if="integral==0">
      <ul>
        <li @click="toPage('/pages/my/integral/main')">
          <img src="../../../../static/my/integral.png"/>
          <div>
            <p>学习积分<span></span></p><span>：</span>
            <span class="ct">{{info.score}}</span>
            <img src="../../../../static/my/line.png"/>
          </div>
        </li>
      </ul>
    </div>
    <div class="line"></div>
    <div class="table">
      <ul>
        <li @click="toPage('/pages/my/support/main')">
          <img src="../../../../static/my/manual.png"/>
          <div>
            <p>操作手册<span></span></p><span></span>
            <span class="ct"></span>
            <img src="../../../../static/my/line.png"/>
          </div>
        </li>
        <li @click="toPage('/pages/my/password/main')">
          <img src="../../../../static/my/setup.png"/>
          <div>
            <p>设置登录密码<span></span></p><span></span>
            <span class="ct"></span>
            <img src="../../../../static/my/line.png"/>
          </div>
        </li>
        <li @click="show_pro(1)">
          <img src="../../../../static/my/signout.png"/>
          <div>
            <p>退出登录<span></span></p><span></span>
            <span class="ct"></span>
            <img src="../../../../static/my/line.png"/>
          </div>
        </li>
        <li @click="show_pro(2)">
          <img src="../../../../static/my/cancellation.png"/>
          <div>
            <p>注销账号<span></span></p><span></span>
            <span class="ct"></span>
            <img src="../../../../static/my/line.png"/>
          </div>
        </li>
      </ul>
    </div>
    <official-account @load="load" @error="err"></official-account>
  </div>
  <tab123 :tabCd="tabCd"></tab123>


  <!-- 弹窗 -->
  <div class="modalMask" v-if="isModel"></div>
  <div class="modalDialog" v-if="changeModel">
    <div class="modalContent">
      <p class="title">提示</p>
      <p v-if="type==1" class="contentTip">您是否退出登录？</p>
      <p v-if="type==2" class="remind">注销账号将删除本人及从属的所有信息，并不可恢复。是否确认注销{{info.realNm}} {{info.mob}}的账号？</p>
    </div>
    <div class="modalFooter">
      <div class="btnCancel" @tap="tapCancel">取消</div>
      <div class="btnConfirm" @tap="confirmSend">确定</div>
    </div>
  </div>

</div>
</template>

<script>
  import tab123 from "../../../components/tabNew.vue";
  export default {
    data(){
      return{
        tabCd:'my',
        info2:{},
        info:{
          wxNm:'',
          mob:'',
          realNm:'',
          sex:'',
          unit:'',
          post:'',
          status:'',
        },
        integral:0,
        //权限
        permission:{
          addTask:false,//添加
          auditTask:false,//审核
          cancelTask:false,//撤销
          finishTask:false,//完成
        },
        status:'',
        //弹窗相关
        changeModel: false,
        isModel: false,
        type: 0, //0:退出登录；2：注销；
        cd: 2,
        subId:'',//我的subId
      }
    },
    components: {
      tab123,
    },
    async onLoad(){

    },
    onShareAppMessage (res) {
      return {
        title: '个人中心',
        desc: "个人中心页",
        path: '/pages/my/index/main'
      }
    },
    async onShow(options){
      // console.log('场景值',options.scene)
      if(!wx.getStorageSync('yui3-token')){
        wx.showModal({
          title: '提示',
          content: '您还没有登录，立即登录',
          success (res) {
            if (res.confirm) {
              wx.reLaunch({url:'/pages/login/index/main'})
            } else if (res.cancel) {
              wx.navigateBack()
            }
          }
        })
        return
      }
      // this.subId = wx.getStorageSync("userInfo").subId
      // wx.removeStorageSync('addTaskPermission')
      this.getCompany()
      this.getMyPermit()
    },
    methods:{
      err(e){
        console.log('err')
        console.log(e)
      },
      load(e){
        console.log('load')
        console.log(e)
      },
      //授权
      loginBtnClick(e){
        let that = this
        wx.getUserInfo({
          success: res => {
            //调用后端接口保存
            let param = {
              imgUrl: res.userInfo.avatarUrl,
              nickname: res.userInfo.nickName
            };
            //保存头像昵称
            that.api.saveInfo(param).then(()=>{
              //更新用户信息
              that.getInfo()
            });
          }
        });
      },

      toPage(url){
        this.until.aHref(url)
      },
      toPageUnit(){
         if(this.info.status==20){
           this.until.aHref('/pages/my/position/main')
         }else {
           this.until.aHref('/pages/my/company/main')
         }
      },
      //查询我的单位个人信息
      async getCompany(){
        let data = await this.api.myCompany()
        this.info = data.data
        // status: "状态 (-2：已注销，0：待提交，10：待审批，20：审批通过，30：审批不通过)"
        if(this.info.status == -2){
          this.status = '已注销'
        }
        if(this.info.status == 0){
          this.status = '待提交'
        }
        if(this.info.status == 10){
          this.status = '待审批'
        }
        if(this.info.status == 20){
          this.status = '审批通过'
        }
        if(this.info.status == 30){
          this.status = '审批不通过'
        }
      },
      //查询我的权限
     async getMyPermit(){
        let data = await this.api.MyPermit()
        //在缓存里存放任务权限
        //添加任务权限
        wx.setStorageSync('addTaskPermission',data.data.addTaskPermission);
        //审核任务权限
        wx.setStorageSync('auditTaskPermission',data.data.auditTaskPermission);
        //撤销任务权限;
        wx.setStorageSync('cancelTaskPermission',data.data.cancelTaskPermission);
        this.permission.addTask = wx.getStorageSync('addTaskPermission');
        this.permission.auditTask = wx.getStorageSync('auditTaskPermission');
        this.permission.cancelTask = wx.getStorageSync('cancelTaskPermission');
     },
      //  弹框取消
      tapCancel() {
        console.log("取消");
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      },
      //  确认
      confirmSend() {
        console.log("确认");
        //1:退出登录 2:注销账户
        if(this.type == 1){
          this.api.logOut().then(res=>{
            if(res.code == 0){
              wx.showToast({
                title: '您已退出登录，请登录',
                icon:'none',
                duration: 1000  // 提示窗停留时间，默认1500ms
              })
              wx.clearStorage()
              wx.removeStorageSync('yui3-token')
              wx.removeStorageSync('userInfo')
              setTimeout(()=>{
                wx.reLaunch({url:'/pages/login/index/main'})
              },1000)
            }
          })
        }else if(this.type == 2){
          console.log('1')
          this.api.cancel().then(res=>{
            if(res.code == 0){
              wx.showToast({
                title: '您已注销账户',
                icon:'success',
                duration: 1000  // 提示窗停留时间，默认1500ms
              })
              wx.removeStorageSync('yui3-token')
              wx.removeStorageSync('userInfo')
              setTimeout(()=>{
                wx.reLaunch({url:'/pages/login/index/main'})
              },1000)
            }
          })
        }
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;

      },
      show_pro(val) {
        if(val==1){
          this.changeModel = !this.changeModel;
          this.isModel = !this.isModel;
          this.type = 1;
        }else if(val == 2){
          this.changeModel = !this.changeModel;
          this.isModel = !this.isModel;
          this.type = 2;
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .noAuthorize{
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top:0;
    z-index: 99;
    background: #ffffff;
    text-align: center;
    box-sizing: border-box;
    .main{
      position: absolute;
      bottom: 100rpx;
      width: 88vw;
      left: 6vw;
      p{
        padding-bottom: 40rpx;
      }
    }
  }
  .home{
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    /*padding-bottom: 145rpx;*/
    background-color: rgba(245, 245, 245, 0.58);
    display: flex;
    flex-direction: column;
    .main{
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .header{
        height: 280rpx;
        width: 100%;
        display: flex;
        align-items: center;
        background-color: #FFFFFF;
        .userImg{
          margin: 0 auto;
          border-radius: 100%;
          object-fit: cover;
          display: block;
          overflow: hidden;
          width: 140rpx;
          height: 140rpx;
        }
      }
      .line{
        height: 10rpx;
        background-color: rgba(222, 222, 222, 0.64);
      }
      .table{
        background-color: #FFFFFF;
        display: flex;
        flex-direction: column;
        padding: 0 30rpx;
        ul li{
          display: flex;
          align-items: center;
          &:last-of-type{
            >div{
              border-bottom: none;
            }
          }
          .userName{
            flex: 1;
          }
          >img{
            width: 40rpx;
            height: 40rpx;
            align-items: center;
            margin-right: 30rpx;
          }
          div{
            display: flex;
            align-items: center;
            flex: 1;
            border-bottom: 1rpx solid #CCCCCC;
            >p{
              min-width: 128rpx;
              font-size: 32rpx;
              text-align: justify;
              color: #303030;
              height: 100rpx;
              line-height: 100rpx;
              >span{
                display: inline-block;
                width: 100%;
              }
            }
            .ct{
              font-size: 30rpx;
              color: #303030;
              flex: 1;
            }
            img{
              float: right;
              width: 14rpx;
              height: 22rpx;
            }
          }
        }

      }
    }


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
    .title{
      font-size: 30rpx;
      text-align: center;
      color: #121214;
      margin-bottom: 5rpx;
    }
    .contentTip {
      text-align: center;
      font-size: 30rpx;
      margin-top: 20rpx;
      color: #333333;
      font-weight: bold;
    }
    .remind{
      color: #EF5B5C;
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
