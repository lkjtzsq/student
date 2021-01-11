var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    footprintList: [],
    commentValue: "",
    commentPanelShow: false,
    index: 0,
    id: 0,
    user_cover: wx.getStorageSync("user_cover") ? wx.getStorageSync("user_cover") : 'https://caishang.5rkk.com/wxxcx/images/icon/footprint.png',
    currentImage: 0,
    imgUrls: [],
    show: false,
    page:1
  },
  change(e) {
  },
  delete(e) {
  },
  hide() {
    setTimeout(() => {
      this.setData({
        show: true
      })
    }, 1000)
  },
  //预览图片
  previewImg: function(event) {
    var current = event.currentTarget.dataset.current
    var list = event.currentTarget.dataset.list
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  //创建评论
  createComment: function(e) {
    var token = wx.getStorageSync("token")
    if (token) {
      var index = e.currentTarget.dataset.index
      var id = e.currentTarget.dataset.id
      this.setData({
        index: index,
        id: id
      })
      this.setData({
        commentPanelShow: !this.data.commentPanelShow
      })
    } else {
      this.setData({
        show: !this.show
      })
    }

  },
  //监听评论input值
  bindinput: function(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },
  //发送评论
  sendComment: function(event) {
    var that = this
    var token = wx.getStorageSync("token")
    var nickname = wx.getStorageSync("nickname")
    var index = this.data.index
    var id = this.data.id
    var commentValue = this.data.commentValue
    var key = 'footprintList[' + index + '].comments'
    if(commentValue==""){
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: '留言不能为空！'  
      })
    }else{
      wx.request({
        url: app.globalData.studentBase + '/api/user/comment',
        method: "POST",
        header: {
          Authorization: token
        },
        data: {
          comment: commentValue,
          key_type: 0,
          key_id: id
        },
        success: function (res) {
          if(res.data.status_code==401){
            wx.navigateTo({
              url: '/pages/login/login'
            })
            return
          }
          that.data.footprintList[index].comments.unshift({
            nickname: nickname,
            comment: that.data.commentValue
          })
          that.setData({
            [key]: that.data.footprintList[index].comments,
            commentPanelShow: !that.data.commentPanelShow
          })
          if (res.data.score.offset) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '留言成功！新增' + res.data.score.offset + '积分'
            })
          }
        }
      })
    }
  
    
  },
  // 获取成长足迹
  getFootprintList: function(token,page) {
    wx.showToast({
      icon: 'loading',
      duration:160000
    })
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/user/album',
      method: "POST",
      header: {
        Authorization: token
      },
      data:{
        page:page
      },
      success: function(res) {
        if(res.data.status_code==401){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        that.data.footprintList = that.data.footprintList.concat(res.data.data)
        that.setData({
          footprintList: that.data.footprintList
        })
        wx.hideToast()
      }
    })
  },
  // 判断token
  checkToken: function() {
    var token = wx.getStorageSync("token")
    if (token) {

      this.getFootprintList(token,this.data.page)
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      wx.hideToast()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.checkToken()
    //获取当前年份
    var year = new Date().getFullYear()
    this.setData({
      year: year
    })
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
    var token = wx.getStorageSync("token")
    this.data.page++
    this.getFootprintList(token, this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})