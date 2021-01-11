var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoDetail:{},
    id:null,
    show:true
  },
  /** 
   *  用户登录判断 
   */
  checkLogin(){
    var token = wx.getStorageSync("token")
    
    if (!token) {
      this.setData({
        show:false
      })
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }else{
      this.setData({
        show:true
      })
    }
  },
  //获取视频详情
  getVideoDetail:function(id){
    var that = this
    var token = wx.getStorageSync("token")
    wx.request({
      url: app.globalData.studentBase +'/api/classroom/detail/video',
      method:"POST",
      data:{
        id:id
      },
      header:{
        Authorization:token
      },
      success:function(res){
        if(res.data.status_code==401){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        var classroom_is_group=res.data.data.classroom.classroom_is_group
        var classroom_group_price=res.data.data.classroom.classroom_group_price
        var isGroup=false
        if(classroom_is_group==1 && classroom_group_price >0){
          isGroup=true
        }
        that.setData({
          videoDetail:res.data.data,
          isGroup:isGroup
        })
      }
    })
  },
  //课程付费
  pay: function () {
    var that = this
    var token = wx.getStorageSync("token");
    var isGroup=this.data.isGroup
    var mode=null
    if(isGroup){
      mode="group"
    }
    if (token) {
      wx.request({
        url: app.globalData.studentBase + '/api/pay/classroom',
        method: "POST",
        header: {
          Authorization: token
        },
        data: {
          classroom_id: that.data.classDetail.id,
          mode:mode
        },
        success: function (res) {
          if(res.data.status_code==401){
            wx.navigateTo({
              url: '/pages/login/login'
            })
            return
          }
          if (res.data.nonceStr) {
            wx.requestPayment({
              //    "appId": "wx54fc31829de59a65",
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              timeStamp: res.data.timestamp,
              success(res) {
                if(res.data.status_code==401){
                  wx.navigateTo({
                    url: '/pages/login/login'
                  })
                  return
                }
                var is_join = "videoDetail.is_join"
                if (res.errMsg == "requestPayment:ok") {
                  that.setData({
                    [is_join]:1
                  })
                  app.globalData.mineCurrentData = 0
                  wx.switchTab({
                    url: "/pages/mine/mine"
                  })
                }
              },
              fail(res) {
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
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoDetail(options.id)
    this.setData({
      id:options.id
    })
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
    this.getVideoDetail(this.data.id)
    this.checkLogin()
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