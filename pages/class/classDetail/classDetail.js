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
  //课程付费
  pay: function () {
    var that = this
    var token = wx.getStorageSync("token");
    if (token) {
      wx.request({
        url: app.globalData.studentBase + '/api/pay/classroom',
        method: "POST",
        header: {
          Authorization: token
        },
        data: {
          classroom_id: that.data.classDetail.id
        },
        success: function (res) {
          console.log(res)
          if (res.data.nonceStr) {
            wx.requestPayment({
              //    "appId": "wx54fc31829de59a65",
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              timeStamp: res.data.timestamp,
              success(res) {
                console.log("成功")
                console.log(res)
                if (res.errMsg == "requestPayment:ok") {
                  // that.setData({
                  //   is_join:1
                  // })
                  app.globalData.mineCurrentData = 0
                  wx.switchTab({
                    url: "/pages/mine/mine"
                  })
                }
              },
              fail(res) {
                console.log("失败")
                console.log(res)
              }
            })
          }else{
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: res.data.message
            })
          }
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }

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