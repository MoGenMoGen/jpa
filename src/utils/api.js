const config = require("./config");
import store from '../store'
import query from "@/utils/query"
import Vue from 'vue'
Vue.prototype.store = store.store;
const app = getApp()

const hostUrl = config.serverURL;
function get(url, data, header, loading) {
  // console.log(url)
  if (loading) {
    wx.showLoading({
      title: "加载中"
    });
  }
  let myData = {};
  if (data) {
    //过滤掉空的参数
    for (let [key, val] of Object.entries(data)) {
      if (val) {
        myData[key] = val;
      }
    }
  }

  let promise = new Promise((resolve, reject) => {
    let token = wx.getStorageSync('yui3-token')
    wx.request({
      data: myData,
      method: "get",
      header: {
        // "Content-Type": "application/x-www-form-urlencoded",
        "yui3-token": token
      },
      url: config.serverURL + url,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          resolve(res.data);
        } else if (res.data.code == 401) {
          wx.removeStorageSync('token')
          wx.showModal({
            title: '提示',
            content: '登录失效了，重新登录',
            success(res) {
              if (res.confirm) {
                wx.reLaunch({ url: '/pages/login/index/main' })
              } else if (res.cancel) {
                wx.navigateBack()
              }
            }
          })
        } else {
          console.log(url)
          console.log(url.indexOf('infoByMob'))
          if (url.indexOf('infoByMob') === -1) {
            wx.showToast({
              icon: "none",
              title: res.data.msg,
              duration: 2000
            });
          }

          // reject(res.data)
        }
      },
      fail: function (err) {
        wx.showToast({
          icon: "none",
          title: JSON.stringify(err),
          duration: 2000
        });
        reject(err);
      },
      complete: function () { }
    });
  });
  return promise;
}

function post(url, data, header) {
  // console.log(url)
  wx.showLoading({
    title: "加载中"
  });
  let promise = new Promise((resolve, reject) => {
    let token = wx.getStorageSync('yui3-token')
    wx.request({
      data: data,
      header: {
        "yui3-token": token
      },
      method: "post",
      url: config.serverURL + url,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          resolve(res.data);
        } else if (res.data.code == 401) {
          wx.removeStorageSync('yui3-token')
          wx.showModal({
            title: '提示',
            content: '登录失效了，重新登录',
            success(res) {
              if (res.confirm) {
                wx.reLaunch({ url: '/pages/login/index/main' })
              } else if (res.cancel) {
                wx.navigateBack()
              }
            }
          })
        } else {

          wx.showToast({
            icon: "none",
            title: res.data.msg,
            duration: 2000
          });
          // reject(res.data.msg)
        }
      },
      fail: function (err) {
        wx.showToast({
          icon: "none",
          title: JSON.stringify(err),
          duration: 2000
        });
        // reject(err)
      },
      complete: function () { }
    });
  });
  return promise;
}

class api {
  //登录
  login(data) {
    return new Promise((resolve, reject) => {
      get("/wxMa/access/loginUser", data).then(res => {
        wx.setStorageSync('userId', res.data.userInfo.subId)
        resolve(res);
      });
    });
  }
  //注册
  register(data) {
    return new Promise(resolve => {
      post("/general/ access/register", data).then(res => {
        resolve(res)
      })
    })
  }
  //登出
  logOut(data) {
    return new Promise((resolve, reject) => {
      get("/general/access/logout", data).then(res => {
        resolve(res);
      });
    });
  }
  //保存头像昵称
  saveInfo(data) {
    return new Promise(resolve => {
      post("/zfw/api/pers/updNickNmAImg", data).then(res => {
        resolve(res.data)
      })
    })
  }
  //查看个人信息
  getUser() {
    return new Promise(resolve => {
      get("/general/auth/getUserInfo").then(res => {
        resolve(res.data)
      })
    })
  }
  //省市区
  getCity(data) {
    return new Promise(resolve => {
      get('/sys/api/region/list?query=' + data).then(res => {
        resolve(res.data.list)
      })
    })
  }
  //查看我的权限
  MyPermit(data) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/pers/getMyPermit", data).then(res => {
        resolve(res);
      });
    });
  }
  myCompanyDetail(id) {
    return new Promise(resolve => {
      get('/zfw/api/pers/unitBindInfo/' + id).then(res => {
        resolve(res.data)
      })
    })
  }
  //我的---单位信息
  myCompany(myId) {
    let id = ''
    if (myId) {
      id = myId
    } else {
      id = wx.getStorageSync("userInfo") ? wx.getStorageSync("userInfo").id : wx.getStorageSync("userId")
    }
    return new Promise((resolve, reject) => {
      get("/zfw/api/pers/unitInformation/" + id).then(res => {
        resolve(res);
        console.log('=================')
        console.log(res.data)
        wx.setStorageSync('userInfo', res.data)
      });
    });
  }
  //单位绑定
  unitBind(data) {
    return new Promise(resolve => {
      post('/zfw/api/pers/unitBindSubmit', data).then(res => {
        resolve(res);
      })
    })
  }
  //政治面貌--数据字典
  getByCd(cd) {
    return new Promise(resolve => {
      get('/sys/cat/listByPcd?cd=' + cd).then(res => {
        resolve(res.data.list)
      })
    })
  }
  //我的个人信息修改
  upd(data) {
    return new Promise(resolve => {
      post("/zfw/api/pers/upd", data).then(res => {
        resolve(res)
      })
    })
  }
  //单位列表
  unitList(data) {
    return new Promise(resolve => {
      get('/zfw/api/unit/list?query=' + data).then(res => {
        resolve(res.data.list)
      })
    })
  }
  //注销账号
  cancel(data) {
    return new Promise(resolve => {
      post("/zfw/api/pers/cancle", data).then(res => {
        resolve(res)
      })
    })
  }
  //设置新密码
  password(data) {
    return new Promise(resolve => {
      post("/sys/user/wxUpdPassword", data).then(res => {
        resolve(res)
      })
    })
  }

  //完成任务
  taskPersLink(data) {
    return new Promise(resolve => {
      post("/zfw/api/taskPersLink/add", data).then(res => {
        resolve(res)
      })
    })
  }
  //最新任务
  newTask(data) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/task/pageForFinishNew?query=" + data).then(res => {
        resolve(res);
      });
    });
  }
  //已完成任务
  finishTask(data) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/task/pageForFinishFinish?query=" + data).then(res => {
        resolve(res);
      });
    });
  }
  //超时任务
  overtimeTask(data) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/task/pageForFinishOutTm?query=" + data).then(res => {
        resolve(res);
      });
    });
  }
  //发布任务-发布中
  publishing(query) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/task/pageForAddPubLish?query=" + query).then(res => {
        resolve(res);
      });
    });
  }
  //发布任务 (发布完成、已撤销)
  publishTask(query) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/task/pageForAdd?query=" + query).then(res => {
        resolve(res);
      });
    });
  }
  //发布任务时获取组织(树形)
  orgTree(data) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/unit/listTreeNode", data).then(res => {
        resolve(res.data.list);
      });
    });
  }

  //获取任务轮播图
  banner(query) {
    return new Promise((resolve, reject) => {
      get("/sys/ad/api/list?query=" + query).then(res => {
        resolve(res);
      });
    });
  }
  //任务详情查询
  myTask(id) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/task/infoForFinish/" + id).then(res => {
        resolve(res);
      });
    });
  }
  //审核任务统计
  SHTaskTotal() {
    return new Promise((resolve, reject) => {
      get("/zfw/api/task/auditCount").then(res => {
        resolve(res.data);
      });
    });
  }
  //审核任务
  SHTask(query) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/task/pageForAudit?query=" + query).then(res => {
        resolve(res);
      });
    });
  }
  //审批任务详情
  SHTaskDetail(id) {
    return new Promise(resolve => {
      get('/zfw/api/task/infoForAudit/' + id).then(res => {
        resolve(res.data)
      })
    })
  }
  //审批任务通过
  SHTackExam(data) {
    return new Promise(resolve => {
      post('/zfw/api/task/auditYes', data).then(res => {
        resolve(res)
      })
    })
  }
  //审批任务不通过
  SHTackExamNo(data) {
    return new Promise(resolve => {
      post('/zfw/api/task/auditNo', data).then(res => {
        resolve(res)
      })
    })
  }
  //审批任务撤销
  SHTackExamCancel(data) {
    return new Promise(resolve => {
      post('/zfw/api/task/cancel', data).then(res => {
        resolve(res)
      })
    })
  }
  copyText(e) {
    let text = e.currentTarget.dataset.text;
    if (typeof text == "number") {
      text = text.toString();
    }
    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: "复制成功"
            });
          }
        });
      }
    });
  }
  //操作手册
  czsc() {
    return new Promise((resolve, reject) => {
      get("/sys/api/param/getValByKey?key=operation_manual").then(res => {
        resolve(res.data);
      });
    });
  }
  //操作手册导航栏
  dhcz() {
    return new Promise((resolve, reject) => {
      get("/sys/api/param/getValByKey?key=show_new_video").then(res => {
        resolve(res.data);
      });
    });
  }
  //  新闻分类列表
  getNewsCat() {
    return new Promise((resolve, reject) => {
      get("/zfw/api/newsCat/list").then(res => {
        resolve(res);
      });
    });
  }
  //  查询新闻列表
  getNewsList(data) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/news/page?query=" + data).then(res => {
        resolve(res);
      });
    });
  }
  getNewsDtl(id) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/news/info/" + id).then(res => {
        resolve(res);
      });
    });
  }

  //图片选择
  chooseImages(type, max) {
    wx.setStorage({
      key: "ifClose",
      data: 'no'
    })
    let promise = new Promise((resolve, reject) => {
      let that = this
      wx.chooseImage({
        // count: max || 9,           //一次最多可以选择的图片张数
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: type || ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {

          wx.showLoading({
            title: '上传中...',
          })
          let img = res.tempFilePaths
          resolve(img)
          // that.upLoad(res.tempFilePaths[0])
        },
        fail: function (err) {
          console.log(err)
        },
        complete: function () {

        }
      })
    })
    return promise
  }
  //上传操作
  async upLoad(imgPath) {
    let token = wx.getStorageSync('yui3-token')
    // if(!token){
    //   token = await getToken2()
    // }
    console.log(imgPath)
    return new Promise((resolve, reject) => {
      let that = this
      //上传文件
      wx.uploadFile({
        url: hostUrl + '/general/oss/upload',
        filePath: imgPath,
        name: 'img0',
        header: {
          "Content-Type": "multipart/form-data",
          "yui3-token": token
        },
        success: function (res) {
          console.log('================')
          console.log(res)
          let img = JSON.parse(res.data).data

          resolve(img)
        },
        fail: function (res) {

          wx.showModal({
            title: '错误提示',
            content: res.msg,
            showCancel: false,
            success: function (res) {
            }
          })
        },
        complete: function () {
          wx.hideLoading();
        }
      });
    })
  }
  //  视频推荐列表
  getRecmmondList(data) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/news/videoRecommend?query=" + data).then(res => {
        resolve(res);
      });
    });
  }
  //发布任务数量统计
  pubTaskTotal() {
    return new Promise((resolve, reject) => {
      get("/zfw/api/task/addCount").then(res => {
        resolve(res.data);
      });
    });
  }
  //发布任务(保存)
  savePubTask(data) {
    return new Promise(resolve => {
      post("/zfw/api/task/save", data).then(res => {
        resolve(res)
      })
    })
  }
  //发布任务(发布)
  addPubTask(data) {
    return new Promise(resolve => {
      post("/zfw/api/task/add", data).then(res => {
        resolve(res)
      })
    })
  }
  //发布任务详情
  myPubTask(id) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/task/info/" + id).then(res => {
        resolve(res.data);
      });
    });
  }
  //发布任务统计
  finishCount(data) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/task/finishCount", data).then(res => {
        resolve(res.data);
      });
    });
  }
  //积分分页
  getIntegral(data) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/persScoreLog/page?query=" + data).then(res => {
        resolve(res);
      });
    });
  }
  // 阅读新闻获得分数
  postReadNew(data) {
    return new Promise(resolve => {
      post("/zfw/api/persScoreLog/userReadNew", data).then(res => {
        resolve(res)
      })
    })
  }
  //操作手册分页列表
  getHelp(data) {
    return new Promise((resolve, reject) => {
      get("/zfw/api/help/page?query=" + data).then(res => {
        resolve(res);
      });
    });
  }
  //操作手册详情
  getHelpInfo(id) {
    return new Promise((resolve, reject) => {
      get('/zfw/api/help/info/' + id).then(res => {
        resolve(res);
      });
    });
  }
  //新闻筛选省市区
  getNewsCity(data) {
    return new Promise(resolve => {
      get('/zfw/api/newsAddr/list?query=' + data).then(res => {
        resolve(res.data.list)
      })
    })
  }
  //获取积分
  getyearScore(data) {
    return new Promise(resolve => {
      get('/zfw/api/persScoreLog/userYearSocre', data).then(res => {
        resolve(res.data)
      })
    })
  }
  //获取后台项目名称
  xmmc() {
    return new Promise((resolve, reject) => {
      get("/sys/api/param/getValByKey?key=app_project_name").then(res => {
        resolve(res.data);
      });
    });
  }
  //获取投票分页列表
  getVoteList(query) {
    return new Promise((resolve, reject) => {
      get('/vote/act/api/page?query=' + query, '').then(res => {
        resolve(res)
      })
    })
  }
  //获取投票详情
  getVoteDetail(id) {
    return new Promise((resolve, reject) => {
      get('/vote/act/api/info/' + id).then(res => {
        resolve(res);
      });
    });
  }
  //候选人分组列表查询
  getGroupList(query) {
    return new Promise((resolve, reject) => {
      get('/vote/group/api/list?query=' + query,).then(res => {
        resolve(res)
      })
    })
  }
  //候选人列表查询
  getWaitList(query) {
    return new Promise((resolve, reject) => {
      get('/vote/waitlist/api/list?query=' + query,).then(res => {
        resolve(res)
      })
    })
  }
  //获取投票详情
  getWaitInfo(actId) {
    return new Promise((resolve, reject) => {
      get('/vote/waitlist/api/stat/' + actId).then(res => {
        resolve(res);
      });
    });
  }
  //排行榜
  getVoteRanking(query) {
    return new Promise((resolve, reject) => {
      get('/vote/waitlist/api/page?query=' + query,).then(res => {
        resolve(res)
      })
    })
  }
  //投票
  toVote(data) {
    return new Promise(resolve => {
      post("/vote/vote/vote", data).then(res => {
        resolve(res)
      })
    })
  }
  //获取考试/问卷列表
  getAnswerList(query) {
    return new Promise((resolve, reject) => {
      get('/ques/topic/apis/page?query=' + query, '').then(res => {
        resolve(res)
      })
    })
  }
  //获取答题详情
  getAnswerInfo(id) {
    return new Promise((resolve, reject) => {
      get('/ques/topic/apis/home/' + id).then(res => {
        resolve(res);
      });
    });
  }
  //查询排行榜
  getAnswerRanking(query) {
    return new Promise((resolve, reject) => {
      get('/ques/answerStat/apis/ranking?query=' + query,).then(res => {
        resolve(res)
      })
    })
  }
  //获取题目
  getAnswer(data) {
    return new Promise((resolve, reject) => {
      get('/ques/question/apis/listByTopic', data).then(res => {
        resolve(res)
      })
    })
  }
  //提交答案
  postAnswer(data, duration) {
    return new Promise((resolve) => {
      post("/ques/answer/apis/answer?duration=" + duration, data).then(res => {
        resolve(res)
      });
    });
  }
  //获取排行榜
  getRanking(data) {
    return new Promise((resolve, reject) => {
      get('/ques/answerStat/apis/rankingByPers?query=' + data).then(res => {
        resolve(res)
      })
    })
  }
  //获取问卷列表
  getAnswerNotes(query) {
    return new Promise((resolve, reject) => {
      get('/ques/answerStat/apis/pageAnswerStat?query=' + query,).then(res => {
        resolve(res)
      })
    })
  }
  //获取题目
  getQuestion(data) {
    return new Promise((resolve, reject) => {
      get('/ques/question/apis/listByTopicWJ', data).then(res => {
        resolve(res)
      })
    })
  }
  //提交问卷
  postQuestion(data, duration) {
    return new Promise((resolve) => {
      post("/ques/answer/apis/answerWJ?duration=" + duration, data).then(res => {
        resolve(res)
      });
    });
  }
  //获得用户上次获得本单位地址接口
  getAddr(topicId) {
    return new Promise((resolve, reject) => {
      get('/ques/answer/apis/getTopicAnswerAddr/' + topicId).then(res => {
        resolve(res);
      });
    });
  }


}
export { api };
