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
    wx.showLoading({
      mask:true
    })
    let that = this;
    wx.request({
      url: `${app.globalData.studentBase}/api/classroom/hb`,
      method:"POST",
      data:{
        classroom_id:id
      },
      success(res){
        console.log(res)
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
      wx.showLoading({
        mask:true
      })
      let that = this;
      wx.downloadFile({
        url: that.data.poster, 
        success (res) {
          console.log(res)
          if (res.statusCode === 200) {
            let path = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath:path,
              success(res) {
                console.log(res)
                wx.hideLoading();
              },
              fail(err){
                console.log(err)
                wx.hideLoading();
              }
            })
      //   filePath:that.data.poster,
      //   success(res) {
      //     console.log(res)
      //   },
      //   fail(err){
      //     console.log(err)
      //   }
      // })
          }
        }
      })
     
  },
  onShareAppMessage: function () {
    console.log(app.globalData.classroom_name)
    return {
      title: app.globalData.classroom_name,
      path: '/pages/class/classDetail/classDetail?id=' + this.id,
      imageUrl:this.data.poster
    }
  }
})
