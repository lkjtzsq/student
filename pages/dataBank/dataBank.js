var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    selectPerson: true,
    pictureList: [],
    musicList: [],
    nurseryList: [],
    page1: 1,
    page2: 1,
    page: 3
  },
  //资料库详情跳转
  toDataDetail: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/dataBank/dataDetail/dataDetail?id=' + id
    })
  },
  //获取绘本列表
  getPictureList: function (page) {
    wx.showToast({
      icon: 'loading',
      duration: 160000
    })
    var token = wx.getStorageSync("token")
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/materials',
      method: "POST",
      data: {
        page: page,
        material_type:0
      },
      success: function (res) {
        console.log(res)
        if(res.data.status_code==401){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        that.data.pictureList = that.data.pictureList.concat(res.data.data)
        that.setData({
          pictureList: that.data.pictureList
        })
        wx.hideToast()
      }
    })
  },
  //获取歌曲列表
  getMusicList: function (page) {
    wx.showToast({
      icon: 'loading',
      duration: 160000
    })
    var token = wx.getStorageSync("token")
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/materials',
      method: "POST",
      data: {
        page: page,
        material_type:1
      },
      success: function (res) {
        console.log(res)
        if(res.data.status_code==401){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        that.data.musicList = that.data.musicList.concat(res.data.data)
        that.setData({
          musicList: that.data.musicList
        })
        wx.hideToast()
      }
    })
  },
  //获取儿歌列表
  getNurseryList: function (page) {
    var token = wx.getStorageSync("token")
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/materials',
      method: "POST",
      data: {
        page: page,
        material_type:2
      },
      success: function (res) {
        console.log(res)
        if(res.data.status_code==401){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        that.data.nurseryList = that.data.nurseryList.concat(res.data.data)
        that.setData({
          nurseryList: that.data.nurseryList
        })
        wx.hideToast()
      }
    })
  },
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  loadMore1: function (e) {
    this.data.page1++
    this.getPictureList(this.data.page1)
  },
  loadMore2: function (e) {
    this.data.page2++
    this.getMusicList(this.data.page2)
  },
  loadMore3: function (e) {
    this.data.page3++
    this.getNurseryList(this.data.page3)
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.currentTarget.dataset.current
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPictureList(this.data.page1)
    this.getMusicList(this.data.page2)
    this.getNurseryList(this.data.page3)
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