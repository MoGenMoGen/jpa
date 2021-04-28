<template>
<div class="home">
    <org-check :orgList="orgList" :checkList="checkList" @toSearch="toSearch" @confirm="confirm" v-if="orgShow"></org-check>
  <div class="modalMask" v-if="isModel"></div>
  <div class="modalDialog" v-if="changeModel">
    <div class="modalContent">
      <p class="title">提示</p>
      <p>是否发布此任务？</p>
    </div>
    <div class="modalFooter">
      <div class="btnCancel" @tap="tapCancel">取消</div>
      <div class="btnConfirm" @tap="confirmSend">确定</div>
    </div>
  </div>
  <div class="header">
    <ul>
      <li>
        <p class="hd">完成时间</p>
        <span>|</span>
        <!--<choose-date ref="chooseDate" @setTime="setTime"></choose-date>-->
        <picker class="select" mode="date" :start="startTime" :value="time" @change="bindMultiPickerChange">
          <div>
            <p>{{time?time:'请选择日期'}}</p>
            <img src="../../../../static/my/date.png"/>
          </div>
        </picker>
      </li>
<!--      <li>-->
<!--          <p class="hd">截图数量</p>-->
<!--          <span>|</span>-->
<!--          <p class="ct flexBox"><input type="text" v-model="info.needImgNum"><span>张</span></p>-->
<!--      </li>-->
      <li>
        <div class="left">
          <p class="hd">发布人员</p>
          <span>|</span>
          <p class="ct">{{id?info.applyPersRealNm:userInfo.realNm}}</p>
        </div>
        <div class="right" v-if="fromList.length>0">
          <p class="hd">任务平台</p>
          <span>|</span>
          <picker class="select" :range="fromList" range-key='nm' :value="index" @change="bindPickerChange">
            <div>
              <p>{{fromList[index].nm}}</p>
                <img style="width: 17rpx;height: 10rpx;padding-top: 20rpx;" src="../../../../static/my/dropdown.png"/>
            </div>
          </picker>
        </div>
      </li>
      <li>
        <p class="hd">任务对象</p>
        <span>|</span>
        <p class="ct noWarp" @click="orgShow=true">{{checkOrg?checkOrg:'选择任务对象'}}</p>
        <img style="width: 17rpx;height: 10rpx;padding-top: 20rpx;" src="../../../../static/my/dropdown.png"/>
      </li>
      <li>
        <p class="hd">任务来源</p>
        <span>|</span>
        <input type="text" placeholder="请输入任务来源" v-model="info.taskSource"/>
      </li>
      <li>
        <p class="hd">任务标题</p>
        <span>|</span>
        <input type="text" placeholder="请输入任务标题" v-model="info.taskTitle"/>
      </li>
<!--      <li v-if="labelList.length>0">-->
<!--        <p class="hd">任务标签</p>-->
<!--        <span>|</span>-->
<!--        <checkbox-group class="check" @change="checkboxChange">-->
<!--        <label v-for="(item,index) in labelList" :key="index" class="checkbox">-->
<!--          <div>-->
<!--            <checkbox :value="item.nm" :checked="item.checked"/>-->
<!--            <p style="font-size: 24rpx;">{{item.nm}}</p>-->
<!--          </div>-->
<!--        </label>-->
<!--        </checkbox-group>-->
<!--      </li>-->
      <li>
        <p class="hd">操作步骤</p>
        <span>|</span>
        <div class="caoz">
          <p class="red" @click="toPage('/pages/my/support/main')"><img src="../../../../static/task/play1.png"/>观看教程</p>
          <!-- <p style="font-size: 28rpx;">
            {{info.step}}
          </p> -->
          <textarea placeholder="请输入操作步骤" v-show="!orgShow && !isModel" v-model="info.step" style="width: 484rpx;height: 170rpx;float: right;font-size: 28rpx;"></textarea>
        </div>


      </li>
      <li>
        <p class="hd">链接地址</p>
        <span>|</span>
        <textarea placeholder="请输入链接地址" v-show="!orgShow && !isModel" v-model="info.linkUrl" style="width: 484rpx;height: 170rpx;float: right;font-size: 28rpx;"></textarea>
      </li>
      <li v-if="info.status == 30">
        <p class="hd">任务状态</p>
        <span>|</span>
        <p class="ct" style="color: #E22829;">审批未通过</p>
      </li>
      <li v-if="info.status == 0">
        <p class="hd">任务状态</p>
        <span>|</span>
        <p class="ct" style="color: #86AAE5;">已保存</p>
      </li>
      <li v-if="info.status == 30">
        <p class="hd">审批意见</p>
        <span>|</span>
        <p class="ct" style="color: #E22829;">{{info.noPassRmk}}</p>
      </li>
    </ul>
  </div>

  <div class="foot">
    <button @click="show_pro()">发布</button>
    <p @click="save" style="margin-bottom: 45rpx;">保存</p>
  </div>



</div>
</template>

<script>
  import orgCheck from "@/components/orgCheck";
  import chooseDate from '@/components/chooseDate'
  export default {
    components: {orgCheck,chooseDate},
    data(){
      return{
        text:'',
        type:0,
        changeModel: false,
        isModel: false,
        orgShow:false,  //组织的选择
        time: "",
        info:{
          applyPersId:'',//发布人
          applyPersRealNm: '',//发布人姓名
          assignUnitIds: "",//指派单位id(多个用,隔开)
          endTm:'',
          needImgNum:2,// 截图数量
          taskSource:'',//任务来源
          taskTitle:'',//任务标题
          taskTag:'',//任务标签
          step:'',//步骤视频教程
          taskPlat:'',// 任务平台
          linkUrl:''  //链接地址
        },
        status:'',
        userInfo:{},
        cd:0,//1:显示任务状态栏
        // multiArray: [],
        // multiIndex: [0, 0, 0, 0, 0],
        index: 0,
        fromList:[],
        labelList:[],//任务标签
        orgList:[],
        search:'',
        checkList:[],
        checkId:'',
        checkOrg:'',
        id:'',
        startTime:'',
      }
    },
    computed: {
      // newMultiArray: () => {
      //   let array = [];
      //   const date = new Date();
      //   const years = [];
      //   const months = [];
      //   const days = [];
      //   const hours = [];
      //   const minutes = [];
      //   const second=[];
      //   for (let i = 2020; i <= date.getFullYear() + 10; i++) {
      //     years.push("" + i);
      //   }
      //   array.push(years);

      //   for (let i = 1; i <= 12; i++) {
      //     if (i < 10) {
      //       i = "0" + i;
      //     }
      //     months.push("" + i);
      //   }
      //   array.push(months);

      //   for (let i = 1; i <= 31; i++) {
      //     if (i < 10) {
      //       i = "0" + i;
      //     }
      //     days.push("" + i);
      //   }
      //   array.push(days);

      //   for (let i = 0; i < 24; i++) {
      //     if (i < 10) {
      //       i = "0" + i;
      //     }
      //     hours.push("" + i);
      //   }
      //   array.push(hours);

      //   for (let i = 0; i < 60; i++) {
      //     if (i < 10) {
      //       i = "0" + i;
      //     }
      //     minutes.push("" + i);
      //   }
      //   array.push(minutes);

      //   for (let i = 0; i < 60; i++) {
      //     if (i < 10) {
      //       i = "0" + i;
      //     }
      //     second.push("" + i);
      //   }
      //   array.push(second);
      //   return array;
      // }
    },
    onLoad(options){
      this.id = options.id
    },
    onShareAppMessage (res) {
      return {
        title: '发布任务',
        desc: "发布任务页",
        path: '/pages/task/new/main?id='+this.id
      }
    },
    onShow(){
      this.info={
        applyPersId:'',//发布人
        applyPersRealNm: '',//发布人姓名
        assignUnitIds: "",//指派单位id(多个用,隔开)
        endTm:'',
        needImgNum:'',// 截图数量
        taskSource:'',//任务来源
        taskTitle:'',//任务标题
        taskTag:'',//任务标签
        step:'',//步骤视频教程
        taskPlat:'',// 任务平台
        linkUrl:''  //链接地址
      }
      this.fromList={}
      this.checkList=[]
      this.checkId=''
      this.checkOrg=''
      this.search=''
      // this.time='',
      this.changeModel= false,
      this.isModel= false,
      this.orgShow=false,
      this.userInfo = wx.getStorageSync('userInfo')
      console.log('userInfo——————————')
      console.log(this.userInfo)
      this.getData()
      this.getOrgList()
    },
    methods:{
      setTime(val){
        this.info.endTm=val
      },
      //  确认
      confirmSend() {
        this.info.applyPersId=this.userInfo.id
        this.info.applyPersRealNm=this.userInfo.realNm
        this.info.assignUnitIds=this.checkId
        this.info.endTm = this.time+' 23:59:59'
        this.info.taskPlat = this.fromList[this.index].nm
        console.log(this.info)
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
        if(!this.info.assignUnitIds){
          wx.showToast({
            title: '请选择人物对象！',
            icon: 'none',
            duration: 1000
          })
          return
        }
        if(!this.time){
          wx.showToast({
            title: '请选择结束时间！',
            icon: 'none',
            duration: 1000
          })
          return
        }
        // if(!this.info.needImgNum){
        //   wx.showToast({
        //     title: '请输入截图数量！',
        //     icon: 'none',
        //     duration: 1000
        //   })
        //   return
        // }
        if(!this.info.taskSource){
          wx.showToast({
            title: '请输入任务来源！',
            icon: 'none',
            duration: 1000
          })
          return
        }
        if(!this.info.taskTitle){
          wx.showToast({
            title: '请输入任务标题！',
            icon: 'none',
            duration: 1000
          })
          return
        }
        // if(!this.info.taskTag){
        //   wx.showToast({
        //     title: '请选择任务标签！',
        //     icon: 'none',
        //     duration: 1000
        //   })
        //   return
        // }
        if(!this.info.linkUrl){
          wx.showToast({
            title: '请输入链接地址！',
            icon: 'none',
            duration: 1000
          })
          return
        }
        this.api.addPubTask(this.info).then(res=>{
          wx.showToast({
            title: '已发布成功！', // 标题
            icon: 'success',  // 图标类型，默认success
            duration: 1000  // 提示窗停留时间，默认1500ms
          })
          this.cd = 1;
          this.status = '发布完成'
          setTimeout(()=>{
              this.until.back()
           },1500)
        })

      },
      //保存
      save(){
        this.info.applyPersId=this.userInfo.id
        this.info.applyPersRealNm=this.userInfo.realNm
        this.info.assignUnitIds=this.checkId

        this.info.taskPlat = this.fromList[this.index].nm
        console.log(this.info)
        this.api.savePubTask(this.info).then(res=>{
          wx.showToast({
            title: '保存成功！', // 标题
            icon: 'success',  // 图标类型，默认success
            duration: 1000  // 提示窗停留时间，默认1500ms
          })
          this.cd = 1;
          this.status = '已保存'
          setTimeout(()=>{
              this.until.back()
           },1500)
        })
      },
      async getData(){
        let dataNow=this.until.formatDate()
        this.startTime = dataNow.year+'-'+dataNow.month+'-'+dataNow.day

        this.fromList=await this.api.getByCd('task platform')
        this.labelList=await this.api.getByCd('task tag')
        this.labelList.forEach((item,index)=>{
          item.checked=false
          this.$set(this.labelList,index,this.labelList[index])
        })

        if(this.id){
          this.info =await this.api.myPubTask(this.id);
          console.log('详情')
          console.log(this.info)
          this.time = this.info.endTm ? this.info.endTm.split(' ')[0] : ''
          // this.$refs.chooseDate.getCurrentTime(this.info.endTm)
          this.index=this.fromList.findIndex(item=>this.info.taskPlat==item.nm)
          if(this.info.zfwUnitVoList.length>0){
            this.checkList=JSON.parse(JSON.stringify(this.info.zfwUnitVoList))
            console.log(this.checkList)
            this.checkList.forEach((item,index)=>{
              this.checkId+=item.id
              this.checkOrg+=item.unit
              if(index<this.checkList.length-1){
                this.checkId+=','
                this.checkOrg+=','
              }
            })
          }else{
            this.checkList=[]
          }
          let tagList=this.info.taskTag.split(',')
          console.log(tagList)
          // this.checkboxChange({mp:{detail:{value:tagList}}})
          tagList.forEach(item=>{
            this.labelList.forEach((v,k)=>{
              if(v.nm==item){
                v.checked=true
                this.$set(this.labelList,k,this.labelList[k])
              }
            })
          })
        }else{
          console.log('当前日期111111')
          // this.$refs.chooseDate.getCurrentTime()

          console.log(dataNow)
          this.time=dataNow.year+'-'+dataNow.month+'-'+dataNow.day

        }
      },
      toSearch(search){
        this.search=search
        console.log(this.search)
        this.getOrgList()
      },
      confirm(info){
        this.checkList=JSON.parse(info)
        console.log(this.checkList)

        this.checkId=''
        this.checkOrg=''
        this.checkList.forEach((item,index)=>{
          this.checkId+=item.id
          this.checkOrg+=item.unit
          if(index<this.checkList.length-1){
            this.checkId+=','
            this.checkOrg+=','
          }
        })

        this.orgShow=false
      },
      async getOrgList(){
        this.orgList=await this.api.orgTree({nm:this.search})
        console.log('组织——————————')
        console.log(this.orgList)
      },
      toPage(url){
        this.until.aHref(url)
      },

      tapCancel() {
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      },


      //打开弹窗
      show_pro(type) {
        console.log('发布')
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      },
      bindPickerChange(e){
        this.index = e.mp.detail.value
        console.log(e)

      },
      //获取时间日期
      bindMultiPickerChange(e) {
        console.log(e)
        this.time = e.mp.detail.value
        // this.multiIndex = e.target.value;
        // console.log("当前选择的时间", this.multiIndex);
        // const index = this.multiIndex;
        // const year = this.newMultiArray[0][index[0]];
        // const month = this.newMultiArray[1][index[1]];
        // const day = this.newMultiArray[2][index[2]];
        // const hour = this.newMultiArray[3][index[3]];
        // const minute = this.newMultiArray[4][index[4]];
        // const second = this.newMultiArray[5][index[5]];
        // this.time = year + "-" + month + "-" + day + " " + hour + ":" + minute+ ":" + second;
        // this.time = year + "-" + month + "-" + day ;
      },
      checkboxChange(e) {
        // console.log(e)
        console.log('checkbox发生change事件，携带value值为：',e.mp.detail.value)
        const items =this.labelList
        const values = e.mp.detail.value
        this.labelList.forEach(item=>{
          item.checked=false
        })
        values.forEach(v=>{
          this.labelList.forEach((item,index)=>{
            if(v==item.nm){
              item.checked=true
              this.$set(this.labelList,index,this.labelList[index])
            }
          })
        })
        // for (let i = 0, lenI = items.length; i < lenI; ++i) {
        //   items[i].checked = false

        //   for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        //     if (items[i].value === values[j]) {
        //       items[i].checked = true
        //       break
        //     }
        //   }
        // }
        console.log(items)
        this.info.taskTag = ''
        values.forEach((item,index)=>{
          this.info.taskTag+=item
          if(index<values.length-1){
            this.info.taskTag+=','
          }
        })
        console.log('this.info.taskTag',this.info.taskTag)
      },
    }
  }
</script>
<style scoped lang="less">
  .home{
    min-height: 100vh;
    width: 100vw;
    background-color: rgba(245, 245, 245, 0.58);
    padding: 10rpx 20rpx;
    box-sizing: border-box;

    .header{
      background-color: #FFFFFF;
      border-radius: 10rpx;
      width: 710rpx;
      ul{
        display: flex;
        flex-direction: column;
      }
      ul li{
        display: flex;
        align-items: center;
        padding: 0rpx 25rpx;
        height: 110rpx;
        border-bottom: 1rpx solid #E6E6E6;
        .select{
          flex: 1;
          div{
            p{
              float: left;
            }
            img{
              float:right;
              padding-top: 10rpx;
              width:26rpx;
              height: 26rpx;
            }
          }
        }
        .check{
          display: flex;
          .checkbox{
            display: flex;
            div{
              display: flex;
              align-items: center;
              flex: 1;
              margin-right: 5rpx;
              p{
                font-size: 30rpx;
              }
            }
          }
        }
        &:last-of-type{
          border-bottom: none;
        }
        &:nth-child(6){
          height: 220rpx;
          display: flex;
          align-items: normal;
          // flex-direction: column;
          padding-top: 38rpx;
          // p:nth-child(1){
          //   float: left;
          // }
          // span{
          //   float: left;
          // }
        }
        &:nth-child(7){
          height: 220rpx;
          display: flex;
          align-items: normal;
          padding-top: 38rpx;
          p:nth-child(1){
            float: left;
          }
          span{
            float: left;
          }
        }
        .left{
          display: flex;
          float: left;
          width: 380rpx;
          >span{
            color: #BBCBE7;
            margin: 0 20rpx;
          }
          .rt{
            flex: 1;
          }
        }
        .right{
          display: flex;
          float: right;
          flex: 1;
          >span{
            color: #BBCBE7;
            margin: 0 20rpx;
          }
          .rt{
            flex: 1;
          }
        }
        .hd{
          width: 120rpx;
          font-size: 30rpx;
          color: #303030;
          font-weight: bold;
        }
        .caoz{
          flex: 1;
          .red{
            display: flex;
            align-items: center;
            color: #E22829;
            flex: 1;
            >img{
              width: 26rpx;
              height: 26rpx;
              margin-right: 6rpx;
            }
          }
        }

        .ct{
          flex: 1;
          color: #303030;
          font-size: 28rpx;
        }
        .noWarp{
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis;
        }
        .flexBox{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          >input{
            width: 25%;
          }
        }
        >span{
          color: #BBCBE7;
          margin: 0 20rpx;
        }
      }
    }

    .foot{
      width: 710rpx;
      margin-top: 70rpx;
      button{
        background-color: #74A8FF;
        color: #FFFFFF;
        font-size: 30rpx;
        border: none;
        border-radius: 40rpx;
        height: 82rpx;
        margin-bottom: 34rpx;
      }
      p{
        background-color: #FFFFFF;
        color: #74A8FF;
        font-size: 30rpx;
        border-radius: 40rpx;
        height: 82rpx;
        line-height: 82rpx;
        text-align: center;
      }
    }

    .remind{
      color: #EF5B5C;
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
      p{
        height: 60rpx;
      }
    }
    .title{
      font-size: 30rpx;
      text-align: center;
      color: #121214;
      margin-bottom: 5rpx;
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
