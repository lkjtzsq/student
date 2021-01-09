var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enter: ''
  },
  wxLogin:function(){
    var that = this;
    wx.login({
      success(res) {
        console.log(res);
        var code = res.code
        wx.request({
          url: app.globalData.studentBase + '/api/session_key',
          method: "POST",
          data: {
            code: code
          },
          success: function (res) {
            // console.log(res)        
            that.setData(res.data.data)
          }
        })
      }
    })
  },
  //获取用户手机号
  getPhoneNumber(e) {
    var msg = e.detail.errMsg
    var that = this
    var encryptedDataStr = e.detail.encryptedData
    var iv = e.detail.iv
    if (msg == 'getPhoneNumber:ok') {
      wx.showToast({
        title: '登陆中',
        icon:'loading',
        duration:160000
      })  
      that.deciyption(that.data.session_key, that.data.open_id, encryptedDataStr,iv)
    }else{
      wx.showModal({
        title: '提示',
        content: '需要通过授权才能继续，请重新点击并授权！'
      })
    }
  },
  deciyption(sessionID,openId,encryptedDataStr, iv) {
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/login',
      method:"POST",
      data:{
        session_key: sessionID,
        open_id:openId,
        encryptedData: encryptedDataStr,
        iv: iv
      },
      success:function(res){
        // console.log(res)
        wx.setStorageSync("token", res.data.token)
        that.getUserInfo(res.data.token)    
      }
    })
  },
  //获取用户信息
  getUserInfo(token){
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/auth/me',
      method: "POST",
      header: {
        Authorization: token
      },
      success: function (result) {
        var nickname = result.data.data.nickname
        var user_cover = result.data.data.user_cover
        var avatar_path = result.data.data.avatar_path ? result.data.data.avatar_path : "https://caishang.5rkk.com/wxxcx/images/icon/user.png";
        var classroom_name = result.data.data.classroom_name
        var birth = result.data.data.birth ? result.data.data.birth:'保密'
        wx.setStorageSync("nickname", nickname)
        wx.setStorageSync("avatar_path", avatar_path)
        wx.setStorageSync("user_cover", user_cover)
        wx.setStorageSync("classroom_name", classroom_name)
        wx.setStorageSync("birth", birth)
        wx.hideToast()
        if (that.data.enter == "footprint") {
          wx.redirectTo({
            url: '/pages/footprint/footprint'
          })
        } else if (that.data.enter == "dailyPractice") {
          wx.redirectTo({
            url: '/pages/dailyPractice/dailyPractice'
          })
        } else {
          // console.log("哈哈哈")
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onload")
    this.wxLogin()
    if (options.enter) {
      this.setData({
        enter: options.enter
      })
    }
  }
})