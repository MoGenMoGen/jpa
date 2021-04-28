<template>
<div class="orgHome">
  <!--搜索-->
  <div class="search">
    <input placeholder="请输入组织名称搜索" v-model="search" />
    <button @click="toSearch" class="searchBtn">搜索</button>
  </div>
  <div class="content">
    <ul>
      <li v-for="(item,index) in dataList" :key="index"  :style="{'border-bottom':index==dataList.length-1?'none':''}">
        <span @click="toggle(index)" class="lineSp">
            <img :src="item.check?check:noCheck"  @click.stop="toCheck(index)" class="checkI">
            <span class="unitSp">{{ item.unit }}</span>
            <img  v-if="item.hasChild" :src="rightC" :class="item.open?'openI':''" class="rightI">
        </span>

        <ul v-show="item.hasChild && item.open">
          <li v-for="(v, k) in item.children" :key="k" :style="{'border-bottom':k==item.children.length-1?'none':'','border-top':k==0?'1rpx solid #E5E5E5':'','margin-top':k==0?'20rpx':''}">
            <span @click="toggle(index,k)" class="lineSp" style="padding-left: 40rpx;">
              <img :src="v.check?check:noCheck"  @click.stop="toCheck(index,k)" class="checkI">
              <span class="unitSp">{{ v.unit }}</span>
              <img  v-if="v.hasChild" :src="rightC" :class="v.open?'openI':''" class="rightI">
            </span>

            <ul v-show="v.hasChild && v.open">
              <li v-for="(x, y) in v.children" :key="y" :style="{'border-bottom':y==v.children.length-1?'none':'','border-top':y==0?'1rpx solid #E5E5E5':'','margin-top':y==0?'20rpx':''}">
                <span class="lineSp" style="padding-left: 80rpx;">
                  <img :src="x.check?check:noCheck"  @click.stop="toCheck(index,k,y)" class="checkI">
                  <span>{{ x.unit}}</span>
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <button @click="confirm" class="confirmBtn">确认</button>
  </div>
</div>
</template>

<script>
  import rightC from '../../static/images/rightC.png'
  import noCheck from '../../static/images/noCheck.png'
  import check from '../../static/images/check.png'
  export default {
    props: {
      orgList: {
        type: [Object, Array],
        required: true
      },
      checkList:{
        type: [Object, Array],
        required: true
      }
    },
    data(){
      return{
        rightC,
        noCheck,
        check,
        search:'',
        nowCheckList:[],
        // checkList:[],
        dataList:[]
      }
    },
    watch:{
      orgList(){
        this.getList()
      }
    },
    mounted() {
      this.getList()
    },
    methods:{
      toSearch(){
        this.$emit('toSearch',this.search)
      },
      confirm(){
        // let checkId=''
        // this.checkList.forEach((item,index)=>{
        //   checkId+=item.id
        //   if(index<this.checkList.length-1){
        //     checkId+=','
        //   }
        // })
        this.$emit('confirm',JSON.stringify(this.nowCheckList))
      },
      getList(){
        this.dataList=JSON.parse(JSON.stringify(this.orgList))
        this.nowCheckList=JSON.parse(JSON.stringify(this.checkList))
        this.dataList.forEach((item,index)=>{  //一级
          item.open=false
          let flag=0
          this.nowCheckList.forEach(j=>{ //在搜索之后将已勾选的选中
            if(j.id==item.id){
              flag++
            }
          })
          if(flag==0){
            item.check=false
          }else{
            item.check=true
          }
          if(item.children && item.children.length>0){
            item.hasChild=true

            item.children.forEach((v,k)=>{    //二级
              v.open=false
              let flag1=0
              this.nowCheckList.forEach(a=>{//在搜索之后将已勾选的选中
                if(a.id==v.id){
                  flag1++
                }
              })
              if(flag1==0){
                v.check=false
              }else{
                v.check=true
              }

              if(v.children && v.children.length>0){
                v.hasChild=true
                v.children.forEach((x,y)=>{
                  // x.open=false
                  let flag2=0
                  this.nowCheckList.forEach(b=>{//在搜索之后将已勾选的选中
                    if(b.id==x.id){
                      flag2++
                    }
                  })
                  if(flag2==0){
                    x.check=false
                  }else{
                    x.check=true
                  }
                  // if(x.children && x.children.length>0){
                  //   x.hasChild=true
                  // }else{
                  //   x.hasChild=false
                  // }
                })
              }else{
                v.hasChild=false
              }
            })
          }else{
            item.hasChild=false
          }
          this.$set(this.dataList,index,this.dataList[index])
        })
      },
      toCheck(num1,num2,num3){
          if(num3||num3==0){
            this.dataList[num1].children[num2].children[num3].check=!this.dataList[num1].children[num2].children[num3].check
            if(this.dataList[num1].children[num2].children[num3].check){
              this.nowCheckList.push(this.dataList[num1].children[num2].children[num3])
            }else{
              let index=this.nowCheckList.findIndex(item=>item.id==this.dataList[num1].children[num2].children[num3].id)
              this.nowCheckList.splice(index,1)
            }
            this.$set(this.dataList,num1,this.dataList[num1])
          }else if(num2||num2==0){
            this.dataList[num1].children[num2].check=!this.dataList[num1].children[num2].check
            if(this.dataList[num1].children[num2].check){
              this.nowCheckList.push(this.dataList[num1].children[num2])
            }else{
              let index=this.nowCheckList.findIndex(item=>item.id==this.dataList[num1].children[num2].id)
              this.nowCheckList.splice(index,1)
            }
            this.$set(this.dataList,num1,this.dataList[num1])
          }else if(num1||num1==0){
            this.dataList[num1].check=!this.dataList[num1].check
            if(this.dataList[num1].check){
              this.nowCheckList.push(this.dataList[num1])
            }else{
              let index=this.nowCheckList.findIndex(item=>item.id==this.dataList[num1].id)
              this.nowCheckList.splice(index,1)
            }
            this.$set(this.dataList,num1,this.dataList[num1])
          }
          console.log(this.nowCheckList)
      },
      toggle(num1,num2) {
        // if(num3){
        //   this.dataList[num1].children[num2].children[num3].open=!this.dataList[num1].children[num2].children[num3].open
        //   this.$set(this.dataList,num1,this.dataList[num1])
        // }else
        if(num2||num2==0){
          this.dataList[num1].children[num2].open=!this.dataList[num1].children[num2].open
          this.$set(this.dataList,num1,this.dataList[num1])
        }else if(num1||num1==0){
          this.dataList[num1].open=!this.dataList[num1].open
          this.$set(this.dataList,num1,this.dataList[num1])
        }
      }

    }
  }
</script>
<style scoped lang="less">
  .orgHome{
    width: 100vw;
    background-color: rgba(245, 245, 245, 0.58);
    padding: 10rpx 20rpx;
    box-sizing: border-box;
    position: fixed;
    height: 100vh;
    background-color: #f7f7f7;
    z-index: 1000;
    left:0;
    top:0;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    .search{
      background-color: #ffffff;
      border-radius: 10rpx;
      margin: 21rpx 0;
      // width: 710rpx;
      width: 100%;
      height: 80rpx;
      display: flex;
        font-size: 26rpx;
      >input{
        height: 100%;
        padding-left: 82rpx;
        background-color: #FFFFFF;
        border-radius: 10rpx;
        flex: 1;
      }
      .searchBtn{
        height: 100%;
        width: 150rpx;
        padding: 0;
        margin: 0;
        line-height: 80rpx;
        font-size: 28rpx;
        background: #1A89FA;
        color: #ffffff;
        border: none;
      }
    }
    .content{
      background-color: #FFFFFF;
      width: 100%;
      border-radius: 10rpx;
      flex: 1;
      -webkit-overflow-scrolling: touch;
      height: 100%;
      .openI{
        transform:rotate(90deg);
      }
      .checkI{
        width: 30rpx;
        height: 30rpx;
        margin-right: 10rpx;
      }
      .rightI{
        width: 25rpx;
        height: 25rpx;
      }
      .unitSp{
        flex: 1;
      }
      li{
        border-bottom: 1rpx solid #E5E5E5;
        padding: 20rpx 0;
      }
      .lineSp{
        display: flex;
        align-items: center;
        padding: 0 20rpx;
      }
      .confirmBtn{
        position: fixed;
        bottom: 80rpx;
        z-index: 3;
        background-color: #87AAE5;
        color: #ffffff;
        font-size: 30rpx;
        border-radius: 40rpx;
        width: 80%;
        left: 50%;
        margin-left: -40%;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
      }
    }
  }

</style>
