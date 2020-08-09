var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classDetail:{},
    article:null,
    id:null
  },
  
  /**
  * 跳转至视频播放页面
  */
  toClassVideo(e) {
    console.log(e)
   var is_join=this.data.classDetail.is_join
   var id = e.currentTarget.dataset.id
   var index = e.currentTarget.dataset.index
   if(index < this.data.classDetail.classroom_is_video || is_join){
    wx.navigateTo({
      url: '/pages/class/classVideo/classVideo?id='+id,
    })
   }else{
    wx.showModal({
      title: '提示',
      content: '报名后才能观看哦~',
      showCancel:false,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   }
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
        var classroom_is_group=res.data.data.classroom_is_group
        var classroom_group_price=res.data.data.classroom_group_price
        var isGroup=false
        if(classroom_is_group==1 && classroom_group_price >0){
          isGroup=true
        }
        var article = res.data.data.classroom_remark.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p').replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p').replace(/<p>/ig, '<p class="p_class">').replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1').replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1').replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1').replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1').replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img$1 class="pho"').replace(/<ul>/ig, '<ul class="ul_class">').replace(/<li>/ig, '<li class="li_class">').replace(/<span([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<span').replace(/<span([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<span').replace(/<span>/ig, '<span class="span_class">')
        console.log(article)
        that.setData({
          classDetail:res.data.data,
          isGroup:isGroup,
          article: article
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
          console.log(res)
          if (res.data.nonceStr) {
            wx.requestPayment({
              // "appId": "wx54fc31829de59a65",
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              timeStamp: res.data.timestamp,
              success(res) {
                console.log("成功")
                console.log(res)
                var is_join = "classDetail.is_join"
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
    this.getClassDetail(options.id)
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
    this.getClassDetail(this.data.id)
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