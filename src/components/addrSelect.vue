<template>
  <div class="addrSelect">
    <picker
      mode="multiSelector"
      @change="changeAddr"
      @columnchange="ColumnChange"
      range-key="nm"
      :value="cityIndex"
      :range="cityArray"
    >
      <p v-if="myAddr">{{myAddr}}</p>

      <view class="picker" v-if="addr.provice" >
        <span>{{addr.provice}}</span>
        <span>{{addr.city}}</span>
      </view>
      <view class="picker" v-if="!addr.provice" >
        <p>所在地区</p>
      </view>
      <!-- 这里将向下箭头换成向右 -->
      <!--<span class="iconfont">&#xe63f;</span>-->
    </picker>


  </div>
</template>

<script>
export default {
  data(){
    return{
      myAddr:'',
      addr:{
        provice:'',
        city:'',
      },

      cityArray:[[],[]],
      cityIndex:[0,0]
    }
  },
  async mounted(){
    // if(!wx.getStorageSync('token')){
    //   await this.api.getToken()
    // }
    this.getProvice()

  },
  async onShow(){
  },
  methods:{
    setAddr(data){

        let myData = data.split('-')
        this.addr.provice = myData[0]
        this.addr.city = myData[1]
        this.addr.area = myData[2] ? myData[2] : ''

    },
    async getProvice(){
      let qry = this.query.new();
      this.query.toW(qry, "pid",100000, "EQ");
      this.query.toW(qry, "status",0, "EQ");
      let data = await this.api.getCity(encodeURIComponent(this.query.toJsonStr(qry)))
      this.cityArray[0] = data

      console.log(data)
      this.$set(this.cityArray,0,this.cityArray[0])
      this.getCity(this.cityArray[0][0].id)
    },
    async getCity(id){
      // console.log('城市id:'+id)
      let qry = this.query.new();
      this.query.toW(qry, "pid",id, "EQ");
      this.query.toW(qry, "status",0, "EQ");
      this.cityArray[1] = await this.api.getCity(encodeURIComponent(this.query.toJsonStr(qry)))
      this.$set(this.cityArray,1,this.cityArray[1])
    },

    //确定后
    changeAddr(e){
      this.cityIndex = e.mp.detail.value
      this.addr.provice = this.cityArray[0][this.cityIndex[0]].nm
      this.addr.city = this.cityArray[1][this.cityIndex[1]].nm
      console.log(this.cityArray[0][this.cityIndex[0]].nm)
      let addrInfo={}
        addrInfo.nm = this.addr.provice+'-'+this.addr.city
        addrInfo.code = this.cityArray[0][this.cityIndex[0]].id+'-'+this.cityArray[1][this.cityIndex[1]].id
      this.$emit('changeAddr',addrInfo)
    },
    //选择某个地址后下级地址跟着改变
    ColumnChange(e){
      const data = {
        multiArray: this.cityArray,
        multiIndex: this.cityIndex
      }
      data.multiIndex[e.mp.detail.column] = e.mp.detail.value
      switch (e.mp.detail.column) {
        case 0:  //第一列变化
          console.log('1')
          this.cityIndex[1] = 0
          this.getCity(this.cityArray[0][e.mp.detail.value].id)
          break
      }

    }
  }
}
</script>

<style lang="less" scoped>
.addrSelect {
  width: 100%;
  .picker{
    width: 100%;
    display: flex;
    display: -webkit-flex;
    span{
      flex: 1;
    }
    p{
      color: #a6a6a1;
    }
  }
  picker{
    position: relative;
    height: 100%;
    .iconfont{
      position: absolute;
      right: 0;
      top:0;
    }
  }
}
</style>
