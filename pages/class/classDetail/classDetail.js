var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classDetail:{}
  },
  //获取课程详情
  getClassDetail:function(id){
    var token = wx.getStorageSync("token")
    var that = this
    wx.request({
      url: app.globalData.studentBase +'/api/classroom/detail',
      method:"POST",
      header:{
        Authorization:token
      },
      data:{
        classroom_id:id
      },
      success:function(res){
        console.log(res)
        that.setData({
          classDetail:res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getClassDetail(options.id)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})