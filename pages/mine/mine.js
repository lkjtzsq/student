var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: wx.getStorageSync("nickname"),
    avatar_path: wx.getStorageSync("avatar_path"),
    classroom_name: wx.getStorageSync("classroom_name"),
    birth: wx.getStorageSync("birth"),
    classList:[],
    activityList:[],
    goodList:[]
  },
  //联系我们
  contact(){
    wx.navigateTo({
      url: '/pages/contact/contact'
    })
  },
  //我的积分
  getScore(){
    var that=this
    var token = wx.getStorageSync("token")
    wx.request({
      url: app.globalData.studentBase + '/api/auth/me',
      method: "POST",
      header: {
        Authorization: token
      },
      success:function(res){
        console.log(res)
        that.setData({
          userScore:res.data.data.user_score
        })
      }
    })
  },
  //我的课程
  getClassList:function(){
    var token = wx.getStorageSync("token")
    var that = this
    if(token){
      wx.request({
        url: app.globalData.studentBase + '/api/user/user_classroom',
        method: "POST",
        header: {
          Authorization: token
        },
        success: function (res) {
          console.log(res)
          that.setData({
            classList:res.data.data
          })
        }
      })
    }
  },
  //已购活动
  getActivityList: function () {
    var token = wx.getStorageSync("token")
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/user/user_act',
      method: "POST",
      header: {
        Authorization: token
      },
      success: function (res) {
        console.log(res)
        that.setData({
          activityList: res.data.data
        })
      }
    })
  },
  //已购商品
  getGoodList: function () {
    var token = wx.getStorageSync("token")
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/user/user_good',
      method: "POST",
      header: {
        Authorization: token
      },
      success: function (res) {
        console.log(res)
        that.setData({
          goodList: res.data.data
        })
      }
    })
  },
  // 课程详情跳转
  toClassDetail: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/class/classDetail/classDetail?id=' + id
    })
  },
  // 活动详情跳转
  toActivityDetail:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/activity/activity-detail/activity-detail?id=' + id
    })
  },
  //商品详情跳转
  toStoreDetail(e){
    // console.log(e)
    // var id = e.currentTarget.dataset.id
    // wx.navigateTo({
    //   url: '/pages/store/storeDetail/storeDetail?id=' + id
    // })
  },
  //课表
  goSchedule:function(){
    wx.navigateTo({
      url: '/pages/schedule/schedule'
    })
  },
  //订阅
  book: function() {
    wx.requestSubscribeMessage({
      tmplIds: ['S4SP2aG_Cj4lrsyRnncYYG31p8qugOVUKCMvb4kcFEc'],
      success(res) {
        console.log('已授权接收订阅消息')
        console.log(res)
      },
      fail(res) {
        console.log('订阅失败')
        console.log(res)
      }
    })
  },
  //切换
  checkCurrent: function(e) {
    var current = e.currentTarget.dataset.current
    this.setData({
      currentData: current
    })
  },
  login: function() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  // 判断是否登录
  checkLogin: function() {
    var token = wx.getStorageSync("token")
    var nickname = wx.getStorageSync("nickname")
    var avatar_path = wx.getStorageSync("avatar_path")
    var classroom_name=wx.getStorageSync("classroom_name")
    var birth= wx.getStorageSync("birth")
    if (token) {
      this.setData({
        nickname: nickname,
        avatar_path: avatar_path,
        classroom_name: classroom_name,
        birth:birth
      })
    }
  },
  quitLogin: function() {
    this.setData({
      nickname: "",
      avatar_path: ""
    })
    wx.removeStorageSync("token")
    wx.removeStorageSync("nickname")
    wx.removeStorageSync("avatar_path")
    wx.removeStorageSync("user_cover")
    wx.removeStorageSync("classroom_name")
    wx.removeStorageSync("birth")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getClassList()
    this.getActivityList()
    this.getGoodList()
    this.checkLogin()
    this.getScore()
    this.setData({
      currentData: app.globalData.mineCurrentData
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})