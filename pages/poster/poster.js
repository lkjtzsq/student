const app = getApp();
Page({
  data: {
    poster: '',
    id:null
  },
  onLoad(options) {
    let that = this
    this.setData({
      id:options.id
    })
    this.getPoster(options.id);
  },
  getPoster(id){
    wx.showToast({
      icon: 'loading',
      duration: 160000
    })
    let that = this;
    wx.request({
      url: `${app.globalData.studentBase}/api/classroom/hb`,
      method:"POST",
      data:{
        classroom_id:id
      },
      success(res){
        if(res.data.code==200 && res.data.data.hb){
          that.setData({
            poster:res.data.data.hb
          })
          wx.hideLoading();
        }
      },
      fail(err){
        wx.hideLoading();
      }
    })
  },
  extraImage() {
      wx.showToast({
        icon: 'loading',
        duration: 160000
      })
      let that = this;
      wx.downloadFile({
        url: that.data.poster, 
        success (res) {
          if (res.statusCode === 200) {
            let path = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath:path,
              success(res) {
                wx.hideLoading();
                wx.showToast({
                  title: '保存成功',
                })
              },
              fail(err){
                wx.hideLoading();
                wx.showToast({
                  title: '保存失败',
                })
              }
            })
          }
        }
      })
     
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.classroom_name,
      path: '/pages/class/classDetail/classDetail?id=' + this.data.id,
      imageUrl:this.data.poster
    }
  }
})
