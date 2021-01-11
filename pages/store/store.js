var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    selectPerson: true,
    productList: [],
    spellList: [],
    integralList: [],
    page1: 1,
    page2: 1,
    page: 3
  },
  //商品详情跳转
  toStoreDetail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/store/storeDetail/storeDetail?id=' + id
    })
  },
  //获取商品列表
  getProductList: function(page) {
    wx.showToast({
      icon: 'loading',
      duration: 160000
    })
    var token = wx.getStorageSync("token")
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/goods',
      method: "POST",
      header: {
        Authorization: token
      },
      data: {
        page: page
      },
      success: function(res) {
        if(res.data.status_code==401){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        that.data.productList = that.data.productList.concat(res.data.data)
        that.setData({
          productList: that.data.productList
        })
        wx.hideToast()
      }
    })
  },
  //获取拼团列表
  getSpellList: function(page) {
    wx.showToast({
      icon: 'loading',
      duration: 160000
    })
    var token = wx.getStorageSync("token")
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/goods/groups',
      method: "POST",
      header: {
        Authorization: token
      },
      data: {
        page: page
      },
      success: function(res) {
        if(res.data.status_code==401){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        that.data.spellList = that.data.spellList.concat(res.data.data)
        that.setData({
          spellList: that.data.spellList
        })
        wx.hideToast()
      }
    })
  },
  //获取积分兑换列表
  getIntegralList: function(page) {
    var token = wx.getStorageSync("token")
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/goods/scores',
      method: "POST",
      header: {
        Authorization: token
      },
      data: {
        page: page
      },
      success: function(res) {
        if(res.data.status_code==401){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        that.data.integralList = that.data.integralList.concat(res.data.data)
        that.setData({
          integralList: that.data.integralList
        })
        wx.hideToast()
      }
    })
  },
  //获取当前滑块的index
  bindchange: function(e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  loadMore1: function(e) {
    this.data.page1++
      this.getProductList(this.data.page1)
  },
  loadMore2: function(e) {
    this.data.page2++
      this.getSpellList(this.data.page2)
  },
  loadMore3: function(e) {
    this.data.page3++
      this.getIntegralList(this.data.page3)
  },
  //点击切换，滑块index赋值
  checkCurrent: function(e) {
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
  onLoad: function(options) {
    this.getProductList(this.data.page1)
    this.getSpellList(this.data.page2)
    this.getIntegralList(this.data.page3)
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