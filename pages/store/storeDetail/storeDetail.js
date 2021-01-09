var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeDetail:{

    }
  },
  //商城付费
  pay: function () {
    var that = this
    var token = wx.getStorageSync("token");
    var isGroup=this.data.isGroup
    var mode=null
    if(isGroup){
      mode="group"
    }
    if (token) {
      wx.getSetting({
        success(res) {
          if(res.data.status_code==401){
            wx.navigateTo({
              url: '/pages/login/login'
            })
            return
          }
          console.log("vres.authSetting['scope.address']：", res.authSetting['scope.address'])
          if (res.authSetting['scope.address']) {
            console.log("获取地址授权成功")
            wx.chooseAddress({
              success(res) {
                console.log(res)
                console.log(res.userName)
                console.log(res.postalCode)
                console.log(res.provinceName)
                console.log(res.cityName)
                console.log(res.countyName)
                console.log(res.detailInfo)
                console.log(res.nationalCode)
                console.log(res.telNumber)
                wx.request({
                  url: app.globalData.studentBase + '/api/pay/good',
                  method: "POST",
                  header: {
                    Authorization: token
                  },
                  data: {
                    good_id: that.data.storeDetail.id,
                    good_number: 1,
                    address:res,
                    mode:mode
                  },
                  success: function (res) {
                    console.log(res)
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
                          console.log("成功")
                          console.log(res)
                          if (res.errMsg == "requestPayment:ok") {
                            app.globalData.mineCurrentData = 2
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
                        content:res.data.message  
                      })
                    }
                  },
                  fail: function (err) {
                    console.log(err)
                  }
                })
              }
            })

          } else {
            if (res.authSetting['scope.address'] == false) {
              console.log("获取地址授权失败")
              wx.openSetting({
                success(res) {
                  console.log(res.authSetting)
                }
              })
            } else {
              console.log("eee")
              wx.chooseAddress({
                success(res) {
                  console.log(res)
                  console.log(res.userName)
                  console.log(res.postalCode)
                  console.log(res.provinceName)
                  console.log(res.cityName)
                  console.log(res.countyName)
                  console.log(res.detailInfo)
                  console.log(res.nationalCode)
                  console.log(res.telNumber)
                  wx.request({
                    url: app.globalData.studentBase + '/api/pay/good',
                    method: "POST",
                    header: {
                      Authorization: token
                    },
                    data: {
                      good_id: that.data.storeDetail.id,
                      good_number: 1,
                      address: res,
                      mode:mode
                    },
                    success: function (res) {
                      console.log(res)
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
                            console.log("成功")
                            console.log(res)
                            if (res.errMsg == "requestPayment:ok") {
                              // that.setData({
                              //   is_join:1
                              // })
                              app.globalData.mineCurrentData = 2
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
                      }
                    },
                    fail: function (err) {
                      console.log(err)
                    }
                  })
                }
              })
            }
          }
        }
      })
     
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var token = wx.getStorageSync("token")
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/goods/detail',
      method: "POST",
      header: {
        Authorization: token
      },
      data:{
        good_id:id
      },
      success: function (res) {
        console.log(res)
        if(res.data.status_code==401){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        var good_is_group=res.data.data.good_is_group
        var good_group_price=res.data.data.good_group_price
        var isGroup=false
        if(good_is_group==1 && good_group_price >0){
          isGroup=true
        }
        that.setData({
          storeDetail: res.data.data,
          isGroup:isGroup
        })
      }
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