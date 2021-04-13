<template>
<div class="home">
  <div class="orgBox" v-if="orgShow">
    <org-check :orgList="orgList" :checkList="checkList" @toSearch="toSearch" @confirm="confirm"></org-check>
  </div>
  <div class="header">
    <ul>
      <li>
        <p class="hd">任务编号</p>
        <span>|</span>
        <p class="ct">{{info.code}}</p>
      </li>
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
<!--        <p class="hd">完成时间</p>-->
<!--        <span>|</span>-->
<!--        <p class="ct">2020-09-10 24:00:00</p>-->
<!--      </li>-->
<!--      <li>-->
<!--        <p class="hd">截图数量</p>-->
<!--        <span>|</span>-->
<!--        <input style="flex:0.15;" type="text" placeholder="数量" v-model="info.needImgNum"/>张-->
<!--      </li>-->
      <li>
        <div class="left">
          <p class="hd">发布人员</p>
          <span>|</span>
          <p class="ct">{{info.applyPersRealNm}}</p>
        </div>
        <div class="right">
          <p class="hd">任务平台</p>
          <span>|</span>
          <picker class="select" :range="fromList" :index="index" range-key='nm' :value="index" @change="bindPickerChange">
            <div>
              <p>{{info.taskPlat}}</p>
              <img style="width: 17rpx;height: 10rpx;padding-top: 20rpx;" src="../../../../static/my/dropdown.png"/>
            </div>
          </picker>
        </div>
      </li>
      <li>
        <p class="hd">任务对象</p>
        <span>|</span>
        <p class="ct noWarp" @click="orgShow=true">{{checkOrg?checkOrg:'选择任务对象'}}</p>
      </li>
      <li>
        <p class="hd">任务来源</p>
        <span>|</span>
        <input type="text" placeholder="请输入任务来源" v-model="info.taskSource"/>
      </li>
      <li>
        <p class="hd">任务标题</p>
        <span>|</span>
        <input type="text" placeholder="请输入任务来源" v-model="info.taskTitle"/>
      </li>
<!--      <li>-->
<!--        <p class="hd">任务标签</p>-->
<!--        <span>|</span>-->
<!--        <checkbox-group class="check" @change="checkboxChange">-->
<!--          <label v-for="(item,index) in labelList" :key="index" class="checkbox">-->
<!--            <div>-->
<!--              <checkbox :value="item.nm" :checked="item.checked"/>-->
<!--              <p>{{item.nm}}</p>-->
<!--            </div>-->
<!--          </label>-->
<!--        </checkbox-group>-->
<!--      </li>-->
      <li>
        <p class="hd">操作步骤</p>
        <span>|</span>
        <p class="red" @click="toPage('/pages/my/support/main')"><img src="../../../../static/task/play1.png"/>观看教程2</p>
        <p style="font-size: 28rpx;">
          <textarea placeholder="请输入操作步骤" v-model="info.step" style="width: 484rpx;float: right;font-size: 28rpx;"></textarea>
        </p>
      </li>
      <li>
        <p class="hd">链接地址</p>
        <span>|</span>
        <p style="width: 484rpx;float: right;font-size: 28rpx;line-height: 45rpx;" >
          <textarea placeholder="请输入链接地址" v-model="info.linkUrl" style="width: 484rpx;float: right;font-size: 28rpx;"></textarea>
          <span @click="toFinishTask" :data-text="info.linkUrl" >(点击查看或复制链接）</span>
        </p>
      </li>
      <li>
        <p class="hd">任务状态</p>
        <span>|</span>
        <p class="ct" style="color: #86AAE5;">待审批</p>
      </li>
      <li>
        <p class="hd">审批意见</p>
        <span>|</span>
      </li>
    </ul>
    <div class="input">
      <img src="../../../../static/task/pen.png"/>
      <input v-model="info.noPassRmk" placeholder="请输入审批意见"/>
    </div>
  </div>

  <div class="foot">
    <button @click="show_pro()">通过</button>
    <p @click="save">不通过</p>
  </div>

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

</div>
</template>

<script>
  import orgCheck from "@/components/orgCheck";
  import chooseDate from '@/components/chooseDate'
  export default {
    components: {orgCheck,chooseDate},
    data(){
      return{
        orgShow:false,
        checkId:'',
        checkOrg:'',
        orgList:[],
        checkList:[],
        labelList:[],//任务标签
        id:'',
        text:'',
        type:0,
        changeModel: false,
        isModel: false,
        time: "",
        info:{
          page:2,
          from:'',
          from2:'',
          from3:'',
          value:'',
          url:'',
        },
        status:'',
        cd:0,//1:显示任务状态栏
        multiArray: [],
        multiIndex: [0, 0, 0, 0, 0],
        index: 0,
        fromList:["公众号","抖音"],
        startTime:'',
      }
    },
    computed: {
      newMultiArray: () => {
        let array = [];
        const date = new Date();
        const years = [];
        const months = [];
        const days = [];
        const hours = [];
        const minutes = [];

        for (let i = 2020; i <= date.getFullYear() + 10; i++) {
          years.push("" + i);
        }
        array.push(years);

        for (let i = 1; i <= 12; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          months.push("" + i);
        }
        array.push(months);

        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          days.push("" + i);
        }
        array.push(days);

        for (let i = 0; i < 24; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          hours.push("" + i);
        }
        array.push(hours);

        for (let i = 0; i < 60; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          minutes.push("" + i);
        }
        array.push(minutes);
        return array;
      }
    },
    onLoad(e){
      this.id = e.id
      this.getInfo()
      this.getOrgList()
    },
    onShareAppMessage (res) {
      return {
        title: "审批",
        desc: "审批详情",
        path: '/pages/video/newsdetail/main?id='+this.id
      }
    },
    onShow(){
      let dataNow=this.until.formatDate()
      this.startTime = dataNow.year+'-'+dataNow.month+'-'+dataNow.day
    },
    methods:{
      setTime(e){
        this.info.endTm = e
      },
      toFinishTask(e){
        if(this.info.taskPlat=='微信'){
          this.toPage('/pages/wxDetail/main?url='+encodeURIComponent(this.info.linkUrl))
        }
        if(this.info.taskPlat=='抖音'){
          this.api.copyText(e)
        }
      },
      async getData(){
        this.fromList=await this.api.getByCd('task platform')
        this.labelList=await this.api.getByCd('task tag')
        this.labelList.forEach((item,index)=>{
          if(this.info.taskTag.indexOf(item.nm)>-1){
            item.checked = true
            this.$set(item,'checked',true)
          }
        })
        console.log(this.labelList)
      },
      checkboxChange(e) {
        // console.log(e)
        console.log('checkbox发生change事件，携带value值为：',e.mp.detail.value)
        // const items = this.labelList
        const values = e.mp.detail.value
        this.info.taskTag = values.join(',')
        this.labelList.forEach((item,index)=>{
          if(this.info.taskTag.indexOf(item.nm)>-1){
            item.checked = true
          }else{
            item.checked = false
          }
          console.log(this.labelList)
          this.$set(this.labelList,index,item)
        })
        // for (let i = 0, lenI = items.length; i < lenI; ++i) {
        //   items[i].checked = false
        //
        //   for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        //     if (items[i].value === values[j]) {
        //       items[i].checked = true
        //       break
        //     }
        //   }
        // }

        // values.forEach((item,index)=>{
        //   this.info.taskTag+=item
        //   if(index<values.length-1){
        //     this.info.taskTag+=','
        //   }
        // })
        console.log('this.info.taskTag',this.info.taskTag)
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
        this.info.assignUnitIds = this.checkId
        this.orgShow=false
      },
      async getOrgList(){
        this.orgList=await this.api.orgTree({nm:this.search})
        // console.log('组织——————————')
        // console.log(this.orgList)
      },
      async getInfo(){
         this.info = await this.api.SHTaskDetail(this.id)
         this.time = this.info.endTm.split(' ')[0]
        // this.$refs.chooseDate.setTime(this.info.endTm)

        this.checkList=JSON.parse(JSON.stringify(this.info.zfwUnitVoList))
        this.checkOrg=''
        let arr = []
         this.info.zfwUnitVoList.forEach(item=>{
            arr.push(item.unit)
         })
        this.checkOrg=arr.join(',')
        this.getData()
      },
      toPage(url){
        this.until.aHref(url)
      },

      tapCancel() {
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      },
      //  确认
      confirmSend() {
        delete this.info.zfwUnitVoList
        this.info.endTm = this.time+' 23:59:59'
          // this.info.delete('zfwUnitVoList')
        this.api.SHTackExam(this.info).then(()=>{
          this.changeModel = !this.changeModel;
          this.isModel = !this.isModel;
          wx.showToast({
            title: '已发布成功！', // 标题
            icon: 'success',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
          setTimeout(()=>{
            this.until.back()
          },1000)
          this.cd = 1;
          this.status = '发布完成'
        })

      },
      //保存
      save(){
        let param = {
          id:this.info.id,
          noPassRmk:this.info.noPassRmk
        }
        this.api.SHTackExamNo(param).then(()=>{
          wx.showToast({
            title: '操作成功！', // 标题
            icon: 'success',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
          setTimeout(()=>{
            this.until.back()
          },1000)
        })
      },
      //打开弹窗
      show_pro(type) {
            this.changeModel = !this.changeModel;
            this.isModel = !this.isModel;
      },
      bindPickerChange(e){
        this.index = e.mp.detail.value
        this.info.taskPlat = this.fromList[this.index].nm
      },
      //获取时间日期
      bindMultiPickerChange(e) {
        this.multiIndex = e.target.value;
        console.log("当前选择的时间", this.multiIndex);
        const index = this.multiIndex;
        const year = this.newMultiArray[0][index[0]];
        const month = this.newMultiArray[1][index[1]];
        const day = this.newMultiArray[2][index[2]];
        const hour = this.newMultiArray[3][index[3]];
        const minute = this.newMultiArray[4][index[4]];
        this.info.endTm = year + "-" + month + "-" + day + " " + hour + ":" + minute+':00';
      },
      // checkboxChange(e) {
      //   console.log('checkbox发生change事件，携带value值为：',e.mp.detail.value)
      //   const items = this.labelList
      //   const values = e.mp.detail.value
      //   for (let i = 0, lenI = items.length; i < lenI; ++i) {
      //     items[i].checked = false
      //
      //     for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
      //       if (items[i].value === values[j]) {
      //         items[i].checked = true
      //         break
      //       }
      //     }
      //   }
      //   this.info.value = values
      //   this.info.taskTag = this.info.value.join(',')
      //   console.log('this.info.value',this.info.value)
      // },
    }
  }
</script>
<style scoped lang="less">
  .home{
    width: 100vw;
    background-color: rgba(245, 245, 245, 0.58);
    padding: 10rpx 20rpx;
    box-sizing: border-box;
    .orgBox{
      position: fixed;
      left: 0;
      top:0;
      width: 100vw;
      height: 100vh;
      background-color: #FFFFFF;
      z-index: 1000;
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
        padding: 30rpx 25rpx;

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
        &:last-of-type{
          border-bottom: none;
        }

        &:nth-child(7){
          display: flex;
          flex-wrap: wrap;
          .hd{
            display: flex;
            align-items: center;
          }
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
        &:nth-child(8){
          /*height: 220rpx;*/
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
        .ct{
          flex: 1;
          color: #303030;
          font-size: 28rpx;
        }
        >span{
          color: #BBCBE7;
          margin: 0 20rpx;
        }
      }
      .input{
        display: flex;
        align-items: center;
        img{
          padding-left: 35rpx;
          width: 27rpx;
          height: 27rpx;
          margin-right: 19rpx;
        }
        >input{
          height: 110rpx;
        }
      }
    }

    .foot{
      width: 710rpx;
      margin-top: 70rpx;
      margin-bottom: 40rpx;
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
