<template>
<div class="home">
  <!--搜索-->
  <div class="search">
    <input placeholder="请输入组织名称搜索" v-model="search"/>
  </div>
  <div class="content">
    <tree :data="orgList"></tree>
    <!-- <tree :data="myData"></tree> -->
  </div>
</div>
</template>

<script>
  import Tree from "../../../components/tree";
  export default {
    components: {Tree},
    props: {
      orgList: {
        type: [Object, Array],
        required: true
      }
    },
    data(){
      return{
        search:'',
        myData:[
          {
            'name': 'Web秀',
            'children': [{
              'name': 'web前端',
              'children': [{
                'name': 'CSS'
              }, {
                'name': 'JavaScript'
              }, {
                'name': 'Vue'
              }, {
                'name': '小程序'
              }, {
                'name': 'Three.js'
              }]
            }, {
              'name': '服务器'
            }, {
              'name': '工具类'
            }]
          }, {
            'name': '今日头条',
            'children': [{
              'name': '图片'
            }, {
              'name': '新闻',
              'children': []
            }]
          }, {
            'name': 'Angular'
          }
        ]
      }
    },
    onShareAppMessage (res) {
      return {
        title: '选择单位',
        desc: "选择单位",
        path: '/pages/task/object/main'
      }
    },
    methods:{
    }
  }
</script>
<style scoped lang="less">
  .home{
    height: 100vh;
    width: 100vw;
    background-color: rgba(245, 245, 245, 0.58);
    padding: 10rpx 20rpx;
    box-sizing: border-box;
    .search{
      margin-top: 21rpx;
      width: 710rpx;
      height: 80rpx;
      >input{
        height: 100%;
        padding-left: 82rpx;
        background-color: #FFFFFF;
        border-radius: 10rpx;
      }
    }
    .content{
      background-color: #FFFFFF;
      width: 710rpx;

    }
  }

</style>
