var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityLists:[],
    page:1
  },
  //轮播图跳转
  swiperLink: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    if (type == 2) {
      wx.navigateTo({
        url: '/pages/activity/activity-detail/activity-detail?id=' + id
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getActivityLists("/api/acts",this.data.page)
  },
  //请求热门推荐数据
  getActivityLists: function(url,page) {
    var that = this
    wx.showToast({
      icon: 'loading',
      duration: 160000
    })
    wx.request({
      url: app.globalData.studentBase + url,
      method: "POST",
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
        console.log(res.data.data)
        that.data.activityLists=that.data.activityLists.concat(res.data.data)
        that.setData({
          activityLists: that.data.activityLists
        })
        wx.hideToast()
      },
      fail: function(res) {
        console.log("热门活动列表获取失败")
        console.log(res)
      }
    })
  },
  //进入活动详情
  enterActivityDetail:function(event){
    wx.navigateTo({
      url: 'activity-detail/activity-detail'
    })
  },
  onReachBottom:function(){
    this.data.page++
    this.getActivityLists("/api/acts", this.data.page)
  }
})