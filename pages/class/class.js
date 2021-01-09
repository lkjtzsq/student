var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList:[],
    page:1
  },
  // 课程详情跳转
  toClassDetail:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/class/classDetail/classDetail?id=' + id
    })
  },
  // 获取课程列表
  getClassList:function(page){
    wx.showToast({
      icon: 'loading',
      duration: 160000
    })
    var that = this
    var token = wx.getStorageSync("token")
    wx.request({
      url: app.globalData.studentBase +'/api/classrooms',
      method:"POST",
      header:{
        Authorization:token
      },
      data:{
        page:page
      },
      success:function(res){
        console.log(res)
        if(res.data.status_code==401){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        that.data.classList=that.data.classList.concat(res.data.data)
        that.setData({
          classList: that.data.classList
        })
        wx.hideToast()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getClassList(this.data.page)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.page++
    this.getClassList(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})