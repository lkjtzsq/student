var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //关闭视频
  closeVideo() {
    this.setData({
      videoSrc: ""
    })
  },
  //积分兑换
  convert() {
    var token = wx.getStorageSync('token')
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/pay/jifen/material',
      method: "POST",
      header: {
        Authorization: token
      },
      data: {
        material_id: that.data.id
      },
      success: function(res) {
        console.log(res)
        if(res.data.meterial_source){
          var material_type = res.data.material_type
          const filePath = res.data.meterial_source
          if(material_type=='media'){
            that.setData({
              videoSrc: filePath
            })
          }else{
            wx.showToast({
              title: '素材下载中...',
              icon: 'loading',
              duration: 160000
            })
            wx.downloadFile({
              // 示例 url，并非真实存在
              url: res.data.meterial_source,
              success: function(res) {
                const filePath = res.tempFilePath
                console.log(material_type)
               if(material_type == "image") {
                  wx.previewImage({
                    urls: [filePath]
                  })
                }else {
                  wx.openDocument({
                    filePath: filePath,
                    success: function(res) {
                      console.log('打开文档成功')
                    },
                    fail: function(err) {
                      console.log(err)
                      console.log('打开文档失败')
                    }
                  })
                }
                wx.hideToast()
              },
              fail: function(err) {
                console.log('下载失败')
                console.log(err)
              }
            })
          }
         
        }else{
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: res.data.message 
            })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id
    this.setData({
      id: id
    })
    var token = wx.getStorageSync('token')
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/materials/detail',
      method: "POST",
      header: {
        Authorization: token
      },
      data: {
        material_id: id
      },
      success: function(res) {
        console.log(res)
        that.setData({
          detail: res.data.data
        })
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})