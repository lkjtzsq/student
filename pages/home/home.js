var app = getApp();

Page({

  /**s
   * 页面的初始数据
   */
  data: {
    answer_type: "每日一练",
    is_answer: 0,
    page:1,
    hotLists:[]
  },
  //轮播图跳转
  swiperLink:function(e){
    console.log(e)
    var id=e.currentTarget.dataset.id
    var type =e.currentTarget.dataset.type
    var outsideUrl = e.currentTarget.dataset.outside
    console.log(outsideUrl)
    if(type==2){
      wx.navigateTo({
        url: '/pages/activity/activity-detail/activity-detail?id='+id
      })
    }else if(type==3){
      outsideUrl=encodeURIComponent(outsideUrl)
      wx.navigateTo({
        url: '/pages/outside/outside?outsideUrl=' + outsideUrl
      })
    }else if(type=5){
      wx.navigateTo({
        url: '/pages/class/classDetail/classDetail?id=' + id
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperData("/api/focus/rotation");
    this.getHotData("/api/focus/recommend",this.data.page);
   
  },
  getAnswerStatus: function () {
    var token = wx.getStorageSync("token")
    var that = this
    if (token) {
      wx.request({
        url: app.globalData.studentBase + '/api/auth/me',
        method: "POST",
        header: {
          Authorization: token
        },
        success: function (res) {
          var answer_type = res.data.data.answer_type
          var is_answer = res.data.data.is_answer
          if (answer_type == "week") {
            answer_type = "每周一练"
          } else {
            answer_type = "每日一练"
          }
          that.setData({
            answer_type: answer_type,
            is_answer: is_answer
          })
        }
      })
    }
  },
  onShow: function (options) {
    this.getAnswerStatus()
  },
  onReachBottom:function(optioins){
    this.data.page++
    this.getHotData("/api/focus/recommend", this.data.page);
  },
  //请求轮播图数据
  getSwiperData: function (url) {
    var that = this
    wx.request({
      url: app.globalData.studentBase + url,
      method: "POST",
      data: {
        page: 1
      },
      success: function (res) {

        that.setData({
          swiperLists: res.data.data
        })
      },
      fail: function (res) {
        console.log("轮播图获取失败")
        console.log(res)
      }
    })
  },
  //请求热门推荐数据
  getHotData: function (url,page) {
    var that = this
    wx.showToast({
      icon: 'loading',
      duration: 160000
    })
    wx.request({
      url: app.globalData.studentBase + url,
      method: "POST",
      data: {
        page: page
      },
      success: function (res) {
        that.data.hotLists = that.data.hotLists.concat(res.data.data)
        that.setData({
          hotLists: that.data.hotLists
        })
        wx.hideToast()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  //进入每日一练（打卡）
  enterDailyPractice: function (event) {
    var enter = event.currentTarget.dataset.enter
    var token = wx.getStorageSync("token")
    var is_answer = this.data.is_answer
    if (token) {
      if (!is_answer) {
        wx.navigateTo({
          url: '../dailyPractice/dailyPractice'
        })
      } else {
        wx.showToast({
          title: '您已经打过卡了'
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login?enter=' + enter
      })
    }

  },
  //进入成长足迹
  enterAboutUs: function (event) {

      wx.navigateTo({
        url: '../aboutUs/aboutUs'
      })

  },
  //进入热门活动
  enterActivity: function (event) {
    wx.navigateTo({
      url: '../activity/activity'
    })
  },
  //进入精选课程
  enterClass: function (event) {
    wx.navigateTo({
      url: '../class/class'
    })
  },
  //进入资料库
  enterDataBank: function (event) {
    wx.navigateTo({
      url: '../dataBank/dataBank'
    })
  },
  //转发
  onShareAppMessage: function (event) {
    return {
      // title:"",
      // path: "/pages/dynamic/dynamic",
      // imageUrl:"",
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log(err)
      }
    }
  },
  toClassList(){
    wx.navigateTo({
      url: '../class/classList/classList'
    })
  }
})