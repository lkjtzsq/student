var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityDetail: {}
  },
  //免费报名活动
  joinFree: function() {
    var token = wx.getStorageSync("token")
    var id = this.data.id
    var that = this
    if (token) {
      wx.request({
        url: app.globalData.studentBase + '/api/user/act_join',
        method: "POST",
        header: {
          Authorization: token
        },
        data: {
          act_id: id
        },
        success: function(res) {
          console.log(res)
          if (res.data.success) {
            that.setData({
              is_join: 1
            })
            wx.showToast({
              title: '报名成功'
            })
            app.globalData.mineCurrentData = 1
            wx.switchTab({
              url: "/pages/mine/mine"
            })
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel:false,
              success(res) {
                if (res.confirm) {
                  //console.log('用户点击确定')
                } else if (res.cancel) {
                  //console.log('用户点击取消')
                }
              }
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  //取消报名
  cancelJoin: function() {
    var token = wx.getStorageSync("token")
    var id = this.data.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定取消报名吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.studentBase + '/api/user/act_cancel_join',
            method: "POST",
            header: {
              Authorization: token
            },
            data: {
              act_id: id
            },
            success: function(res) {
              console.log(res)
              if (res.data.success) {
                that.setData({
                  is_join: 0
                })
                wx.showToast({
                  title: '已取消报名'
                })
              }
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  // 获取活动详情
  getActivityDetail: function(id) {
    wx.showToast({
      icon: "loading",
      duration: 160000
    })
    var that = this
    var token = wx.getStorageSync("token")
    wx.request({
      url: app.globalData.studentBase + '/api/act/detail',
      method: "POST",
      header: {
        Authorization: token
      },
      data: {
        act_id: id
      },
      success: function(res) {
        console.log(res)
        var article = res.data.data.act_content.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p').replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p').replace(/<p>/ig, '<p class="p_class">').replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1').replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1').replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1').replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1').replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img$1 class="pho"').replace(/<ul>/ig, '<ul class="ul_class">').replace(/<li>/ig, '<li class="li_class">').replace(/<span([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<span').replace(/<span([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<span').replace(/<span>/ig, '<span class="span_class">')
        that.setData({
          activityDetail: article,
          is_free: res.data.data.is_free,
          act_price: res.data.data.act_price,
          title: res.data.data.act_title
        })
        wx.hideToast()
      }
    })
  },
  //判断用户是否报名
  checkJoin: function(id) {
    var that = this
    var token = wx.getStorageSync("token");
    if (token) {
      wx.request({
        url: app.globalData.studentBase + '/api/user/act_is_join',
        method: "POST",
        header: {
          Authorization: token
        },
        data: {
          act_id: id
        },
        success: function(res) {
          console.log(res)
          that.setData({
            is_join: res.data.data.is_join
          })
        }
      })
    }
  },
  //活动付费
  pay: function() {
    var that = this
    var token = wx.getStorageSync("token");
    if (token) {
      wx.request({
        url: app.globalData.studentBase + '/api/pay/act',
        method: "POST",
        header: {
          Authorization: token
        },
        data: {
          act_id: that.data.id
        },
        success: function(res) {
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
                if (res.errMsg == "requestPayment:ok"){
                  // that.setData({
                  //   is_join:1
                  // })
                  app.globalData.mineCurrentData=1
                  wx.switchTab({
                    url: "/pages/mine/mine"
                  })
                }else{
                  
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
              showCancel: false,
              content: res.data.message
            })
          }
        },
        fail: function(err) {
          console.log(err)
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id
    this.setData({
      id: id
    })
    this.checkJoin(this.data.id)
    this.getActivityDetail(this.data.id)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})