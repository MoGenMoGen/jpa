<template>
  <div id="home">
    <div class="content" >
      <!--首页部分-->
      <div class="index" v-if="type == 1">
        <img src="http://jiapingan.oss-cn-hangzhou.aliyuncs.com/ba90ff31823340e98fae2db0ae122977.png" class="title"/>
        <div class="line">
          <div><p>活动时间</p></div>
          <div>
            <p>
              {{info.actFrTm}} 至  {{info.actToTm}}
            </p>
          </div>
        </div>
        <div class="line">
          <div><p>答题规则</p></div>
          <div>
            <p v-html="info.descr" style="height: 350rpx;"></p>
          </div>
        </div>
        <div class="bottom">
          <p @click="toAnswer()">开始答题</p>
          <p @click="toRanking()">排行榜</p>
          <p @click="toPast()">答题记录</p>
        </div>
      </div>
      <!--答题部分-->
      <div class="answer" v-if="type == 2">
        <div class="head">
          <img src="http://jiapingan.oss-cn-hangzhou.aliyuncs.com/708d423bebbb4f7891e72c389d77e9ab.png" v-if="answerList[index]&&answerList[index].type == 1"/>
          <img src="http://jiapingan.oss-cn-hangzhou.aliyuncs.com/1f14df7f1f64411287719bf920453a23.png" v-if="answerList[index]&&answerList[index].type == 2"/>
          <span>{{index+1 > total? total:index+1}}/{{total}}</span>
          <p v-if="showHint == 1" @click="show_pro()"><img src="../../../../static/activity/小提示.png"/>查看提示</p>
        </div>
        <div class="cont">
          <div class="subject" v-if="answerList[index]">
            {{answerList[index].nm}}
          </div>
          <div class="option"  v-if="answerList[index]&&answerList[index].type == 1" >
            <div  v-for="item in answerList[index].quesOptionsVos" :key="item.id" @click="toChoose(item)" :class="{active:item.id==selectId}">
              <p>{{item.cd}}.{{item.nm}}</p>
<!--              <p>{{item.ans}}</p>-->
            </div>
          </div>
          <!--多选题-->
          <div class="option" v-if="answerList[index]&&answerList[index].type == 2">
            <div v-for="item in answerList[index].quesOptionsVos" :key="item.id" @click="toChoose2(item)" :class="{active:item.selected}">
              <p>{{item.cd}}.{{item.nm}}</p>
<!--              <p>{{item.ans}}</p>-->
            </div>
          </div>
          <div class="confirm"  >
            <p @click="toSubmit">确定</p>
          </div>
        </div>
      </div>

      <!--完成答题，查看答案-->
      <div class="answer" v-if="type == 3">
        <div class="head">
          <img src="http://jiapingan.oss-cn-hangzhou.aliyuncs.com/708d423bebbb4f7891e72c389d77e9ab.png" v-if="answerList[index]&&answerList[index].type == 1"/>
          <img src="http://jiapingan.oss-cn-hangzhou.aliyuncs.com/1f14df7f1f64411287719bf920453a23.png" v-if="answerList[index]&&answerList[index].type == 2"/>
          <span>{{index+1 > total? total:index+1}}/{{total}}</span>
          <p v-if="showHint == 1" @click="show_pro()"><img src="../../../../static/activity/小提示.png"/>查看提示</p>
        </div>
        <div class="cont">
          <div class="subject" v-if="answerList[index]">
            {{answerList[index].nm}}
          </div>
          <div class="option"  v-if="answerList[index]&&answerList[index].type == 1" >
            <div  v-for="item in answerList[index].quesOptionsVos" :key="item.id" :class="[item.id==selectId && item.type ==1 ?'correct':'none',item.id==selectId && item.type ==0 ?'error':'none',item.type ==1?'correct':'none']">
              <p>{{item.cd}}.{{item.nm}}</p>
              <p v-if="item.id==selectId && item.type ==0" style="display: flex;align-items: center;font-size: 30rpx;">×</p>
              <p v-if="item.type ==1" style="display: flex;align-items: center;font-size: 30rpx;">√</p>
            </div>
          </div>
          <!--多选题-->
          <div class="option" v-if="answerList[index]&&answerList[index].type == 2">
            <div v-for="item in answerList[index].quesOptionsVos" :key="item.id"  :class="[item.selected && item.type ==1 ?'correct':'none',item.selected && item.type ==0 ?'error':'none',item.type ==1?'correct':'none']">
              <p>{{item.cd}}.{{item.nm}}</p>
              <p v-if="item.selected && item.type ==0" style="display: flex;align-items: center;font-size: 30rpx;">×</p>
              <p v-if="item.type ==1" style="display: flex;align-items: center;font-size: 30rpx;">√</p>
            </div>
          </div>
          <div class="confirm"  >
            <p @click="toNext">下一题</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <div class="modalMask" v-if="isModel"></div>
    <div class="modalDialog" v-if="changeModel">
      <div class="modalContent">
        <div class="title">
          <p>提示</p>
          <img @click="close()" src="../../../../static/activity/关闭.png"/>
        </div>
        <p class="contentTip">夸克是当前认知的两个基本微粒组中的一个，是亚原子，不可再 分（到目前为止）微粒，表示最小的物质单位。？</p>
      </div>
    </div>

    <!--弹窗二-->
    <div class="modalMask2" v-if="isModel2"></div>
    <div class="modalDialog2" v-if="changeModel2">
      <div class="modalContent2" @click="close2()">
        <p><img src="../../../../static/activity/未开始.png"/></p>
        <p v-if="begin == 0">活动已结束，请留意活动规则！</p>
        <p v-if="begining == 0">活动未开始，请留意活动规则！</p>
      </div>
    </div>

    <!--弹窗三-->
    <div class="modalMask3" v-if="isModel3"></div>
    <div class="modalDialog3" v-if="changeModel3">
      <div class="modalContent3" >
        <p class="header">市区选择</p>
        <div class="cont">
          <picker  :range="addrList" :range-key="'nm'" :value="index2"  @change="bindPickerChange" style="width: 100%;">
            <p class="select" style="width: 100%;font-weight: normal;padding-left: 25rpx;"><span>{{city ? city : '请选择 市 / 区'}}</span><img style="float:right;width:18rpx;height: 10rpx;padding-right: 22rpx;" src="../../../../static/my/dropdown.png"/></p>
          </picker>
        </div>
        <div class="foot">
          <p @click="close3()">取消</p>
          <p @click="toConfirm()">确认</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        type:1,
        showWarn:false,//显示警告
        changeModel: false,
        changeModel2: false,
        changeModel3: false,
        isModel: false,
        isModel2:false,
        isModel3:false,
        popMsg:'',///弹框提示
        tips:'进入左侧道路超车，无法保证与正常行驶前车的横向安全间距时,交替变换远近光灯加速通过',
        list:[],
        info:{},
        id:'',//答题对应的id
        //当前选中题目
        answerList:[],
        postAnswerList:[],
        index:0,//题目索引
        index2:0,//地址选择索引
        total:25,//题目总数
        showHint: 0,//是否显示提示
        tmLimit: 65,//活动答题时间
        selectId:1,//选中选项的id
        selectedOptions:[],
        begin: 0,//0:已结束；1：可以答题；
        begining: 0,//0:未开始； 1：可以答题；
        postInfo:{
          rmks:'阅读新闻',
          subId:'',
          type:'2',
        },
        addr:{},
        addrList:[],
        city:'',//当前选择的城市
        cityCd:'',//当前选择的城市的Cd
      }
    },
    async onLoad(options){
      this.id = options.id
    },
    onUnload(){
    },
    onShareAppMessage (option) {

    },
    async onShow(){
      this.getAddr();
      // this.getAddrList();
      this.getData();
      this.type = 1;
      this.index = 0;

    },
    methods:{
      //获取当前id对应的活动数据
      async getData(){
        let data = await this.api.getAnswerInfo(this.id)
        this.info = data.data;
        this.info.actFrTm = this.info.actFrTm ? this.info.actFrTm.split(' ')[0] : ''
        this.info.actToTm = this.info.actToTm ? this.info.actToTm.split(' ')[0] : ''
        this.postInfo.rmks = this.info.nm
        let d=new Date(Date.parse(this.info.actToTm.replace(/-/g,"/")));
        let d2=new Date(Date.parse(this.info.actFrTm.replace(/-/g,"/")));
        let curDate=new Date();
        if(d <= curDate){
          console.log("小于当前时间");
          this.begin = 0;//已结束
          this.isModel2 =true;
          this.changeModel2 =true;
        }else{
          console.log("大于当前时间");
          this.begin = 1;//可以答题
        };
        if(d2 <= curDate){
          this.begining = 1;//可以答题
        }else{
          this.begining = 0;//活动还未开始
          this.isModel2 =true;
          this.changeModel2 =true;
        }
      },
      //获取是否有地址
      async getAddr(){
        let data = await this.api.getAddr(this.id)
        this.addr = data.data
        if(this.addr.addrExisted != true){
          this.isModel3 = true;
          this.changeModel3 = true;
          this.getAddrList();
        }else{
          this.city = this.addr.addrNm
          this.cityCd = this.addr.addrCd
        }
      },
      async getAddrList(){
        let qry = this.query.new();
        this.query.toO(qry, "sort", "asc");
        let data = await this.api.getNewsCity(encodeURIComponent(this.query.toJsonStr(qry)))
        this.addrList = data
        console.log(this.addrList)
      },
      //地址更改
      bindPickerChange(e){
        this.index2 = e.mp.detail.value
        this.city = this.addrList[this.index2].nm
        this.cityCd = this.addrList[this.index2].addrCd
        // this.$set(this.info,'sex',this.info.sex)
      },
      //确认地址
      toConfirm(){
        this.close3();
        console.log('city',this.city)
      },
      //获取答题
      async getAnswer(){
        let param ={
          city:this.city,
          topicId:this.info.id
        }
        let data = await this.api.getAnswer(param)
        this.answerList = data.data.data
        this.answerList.forEach(item=>{
          item.quesOptionsVos.forEach(j=>{
            this.$set(j,'selected',false)
          })
        })
        this.total = data.data.data.length
        this.showHint = data.data.showHint
        this.tmLimit = data.data.tmLimit
        console.log(this.answerList)
      },
      //开始答题
      toAnswer(){
        this.type = 2;
        this.getAnswer();
      },
      //答题记录
      toPast(){
        let url = '/pages/activity/note/main?id='+this.info.id
        this.until.aHref(url)
      },
      //单选题选择
      toChoose(item){
        this.selectedOptions.push(item)
        this.selectId=item.id
        this.selectedOptions=[]
        this.selectedOptions.push(item)
      },
      //多选题选择
      toChoose2(item){
        item.selected=!item.selected
        this.selectedOptions=[]
        this.answerList[this.index].quesOptionsVos.forEach(i=>{
          if(i.selected){
            this.selectedOptions.push(i)
          }
        })
        console.log(this.selectedOptions)
      },
      //
      toSubmit(){
        if(this.index +1 <=this.total){
          this.type = 3;
        }
      },
      //获取积分
      postIntegral(){
        this.api.postReadNew(JSON.stringify(this.postInfo))
      },
      //下一题
      toNext(){
        let optionsIds=''
        let optionsCds=''
        console.log(this.selectedOptions)
        if(this.selectedOptions.length>0){
          this.selectedOptions.forEach(item=>{
            optionsIds=optionsIds+item.id+','
            optionsCds=optionsCds+item.cd+','
          })
          //去掉最后一个逗号
          optionsIds = optionsIds.substring(0, optionsIds.lastIndexOf(','));
          optionsCds = optionsCds.substring(0, optionsCds.lastIndexOf(','));
        }else{
          //如果用户没有选择
          optionsIds = '0';
          optionsCds = '0';
        }
        let temp={
          topicId:this.info.id,
          questionId:this.answerList[this.index].id,//问题id
          optionsIds:optionsIds,//用户选项id
          optionsCds:optionsCds,//用户选项cd
          answerIds:this.answerList[this.index].answerIds,//标准答案id
          answerCds:this.answerList[this.index].answerCds,//标准答案cd
          scores:this.answerList[this.index].scores,//本题分数
        }
        this.postAnswerList.push(temp)
        this.selectedOptions=[]
        console.log('index,total',this.index,this.total)
        if(this.index+1 ==this.total){
          let duration=0
          console.log(this.postAnswerList)
          this.api.postAnswer(JSON.stringify(this.postAnswerList),duration + '&addrCd='+ this.cityCd + '&addrNm=' + this.city).then(res=>{
            console.log("答题返回数据：")
            console.log(res)
            this.postInfo.subId = this.info.topicId
            wx.showToast({
              icon: "success",
              title: '答题成功！',
              duration: 1500
            });
            setTimeout(()=>{
              this.postIntegral();
              let url ='/pages/activity/result/main?info='+JSON.stringify(res.data);
              this.until.aHref(url)
              this.selectedOptions=[]
            },1500)
          })
        }else{
          this.type = 2
          this.index++
        }
      },
      show_pro(val){
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      },
      close(){
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      },
      close2(){
        this.changeModel2 = !this.changeModel2;
        this.isModel2 = !this.isModel2;
      },
      close3(){
        this.changeModel3 = !this.changeModel3;
        this.isModel3 = !this.isModel3;
      },
      //前往排行榜
      toRanking(){
       let url = '/pages/activity/ranking/main?id='+this.info.id
       this.until.aHref(url)
      }
    }
  }
</script>

<style scoped lang="less">
  #home{
    min-height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    background-image: url("http://jiapingan.oss-cn-hangzhou.aliyuncs.com/7e98339b62a24166b1b2a5d9dfb638c5.png");
    background-size: 100% 100%;
    background-repeat:no-repeat;
    position: relative;
    .content{
      background-color: #FFFFFF;
      border-radius: 10rpx;
      width: 584rpx;
      position: absolute;
      left: 83rpx;
      top: 24%;
      //首页部分
      .index{
        .title{
          width: 173rpx;
          height: 44rpx;
          padding-top: 43rpx;
          padding-left: 17rpx;
        }
        .line{
          display: flex;
          font-size: 24rpx;;
          padding: 40rpx 35rpx 0 35rpx;
          /*padding-bottom: 58rpx;*/
          color: #333333;
          justify-content: center;
          flex-wrap: wrap;
          >div:nth-child(1){
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          }
          >div:nth-child(2){
            line-height: 40rpx;
            margin-top: 20rpx;
            display: flex;
            flex-direction: column;
            /*flex: 1;*/
            overflow: hidden;
            display: -webkit-flex;
            /*height: 300rpx;*/
            >p{
              overflow-y: auto;
            }
          }
        }
        .bottom{
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          margin-top: 158rpx;
          margin-bottom: 89rpx;
          p:nth-child(1){
            background-color: #0064B2;
            color: #FFFFFF;
            font-size: 24rpx;
            width: 149rpx;
            height: 63rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 40rpx;
          }
          p:nth-child(2){
            background-color: #F32730;
            color: #FFFFFF;
            font-size: 24rpx;
            width: 149rpx;
            height: 63rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 40rpx;
          }
          p:nth-child(3){
            background-color: #108B1C;
            color: #FFFFFF;
            font-size: 24rpx;
            width: 149rpx;
            height: 63rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 40rpx;
          }
        }
      }
      //答题部分
      .answer{
        max-height: 950rpx;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        display: -webkit-flex;
        .head{
          width: 100%;
          display: flex;
          align-items: center;
          padding-top: 43rpx;
          >img{
            width: 137rpx;
            height: 48rpx;
            padding-left: 17rpx;
          }
          >span{
            flex: 1;
            font-size: 24rpx;
            color: #333333;
            margin-left: 22rpx;
          }
          >p{
            display: flex;
            align-items: center;
            line-height: 21rpx;
            font-size: 20rpx;
            color: #0064B2;
            margin-right: 44rpx;
            >img{
              width: 21rpx;
              height: 21rpx;
              margin-right: 13rpx;
            }
          }
        }
        .cont{
          padding: 28rpx 38rpx;
          .subject{
            font-size: 24rpx;
            color:#333333;
            margin-bottom: 40rpx;
          }
          .option{
            color: #343434;
            font-size: 0.24rem;
            div{
              padding: 0.27rem 0.5rem;
              color: #343434 ;
              border: 1px solid #DFDFDF ;
              border-radius: 0.4rem;
              display: flex;
              margin-top: 0.3rem;
              p:nth-of-type(1){
                margin-right: 0.1rem;
                flex: 1;
              }
            }
            .active{
              background-color: rgba(255,154,75,0.21);
              color: #FF7608;
              border: 1px solid #FF9137;
            }
            .error{
              background-color: rgba(243,39,48,0.21);
              color: #F32730;
              border: 1px solid #F99A96;
            }
            .correct{
              background-color: rgba(101,205,125,0.21);
              color: #13A034;
              border: 1px solid #65CD7D;
            }
          }
          .confirm{
            margin-top: 69rpx;
            width: 100%;
            display: flex;
            justify-content: center;
            margin-bottom: 67rpx;
            >p{
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #F32730;
              color: #FFFFFF;
              width: 364rpx;
              height: 63rpx;
              border-radius: 40rpx;
            }
          }
        }
      }
    }
    //弹窗一
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
      width: 100%;
      height: 30%;
      overflow: hidden;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 9999;
      background: #fff;
      border-radius: 10rpx 10rpx 0 0;
    }
    .modalContent {
      box-sizing: border-box;
      display: flex;
      padding: 50rpx 53rpx;
      font-size: 32rpx;
      align-items: center;
      flex-direction: column;
      .title{
        font-size: 38.34rpx;
        color: #010101;
        /*border-bottom: 1rpx solid rgba(0,0,0,0.1);*/
        display: flex;
        width: 100%;
        align-items: center;
        >p{
          flex: 1;
          display: flex;
          /*align-items: center;*/
          justify-content: center;
        }
        >img{
          width: 28rpx;
          height: 28rpx;
        }
      }
      .contentTip{
        margin-top: 70rpx;
        font-size: 24rpx;
        color: #333333;
      }
    }
    //弹窗二
    .modalMask2 {
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
    .modalDialog2 {
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
    .modalContent2 {
      box-sizing: border-box;
      display: flex;
      padding: 50rpx 53rpx;
      font-size: 32rpx;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      >p{
        font-size: 24rpx;
        color: #333333;
        >img{
          width:49rpx;
          height: 49rpx;
        }
      }
    }

    //弹窗3
    .modalMask3 {
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
    .modalDialog3 {
      box-sizing: border-box;
      width: 560rpx;
      overflow: hidden;
      position: fixed;
      top: 40%;
      left: 0;
      z-index: 9999;
      background: #fff;
      margin: -180rpx 95rpx;
      border-radius: 8rpx;
    }
    .modalContent3 {
      box-sizing: border-box;
      display: flex;
      padding: 50rpx 53rpx;
      font-size: 32rpx;
      /*align-items: center;*/
      /*justify-content: center;*/
      flex-direction: column;
      .header{
        font-size: 30rpx;
        color: #333333;
        width: 100%;
        text-align: center;
        margin-bottom: 47rpx;
      }
      .cont{
        height: 65rpx;
        display: flex;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        /*margin-bottom: 84rpx;*/
        .select{
          border: 1rpx solid #CCCCCC;
          box-sizing: border-box;
          height: 65rpx;
          width: 100%;
          display: flex;
          align-items: center;
          color: #999999;
          font-size: 24rpx;
          >span{
            flex: 1;
          }
        }
      }
      .foot{
        margin-top: 84rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        >p:nth-child(1){
          width: 199rpx;
          height: 63rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 30rpx;
          background-color: #BABABA;
          border-radius: 31rpx;
        }
        >p:nth-child(2){
          width: 199rpx;
          height: 63rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 30rpx;
          background-color: #F32730;
          border-radius: 31rpx;
        }
      }
    }
  }

</style>
