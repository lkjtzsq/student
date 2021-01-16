const app = getApp();
Page({
  data: {
    src: '',
    width:0,
    height:0,
  },
  onLoad() {
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        let width = res.windowWidth
        let height = res.windowHeight
        that.setData({
          width,
          height
        })
      }
    })
    this.widget = this.selectComponent('.widget')
    setTimeout(()=>{
      this.renderToCanvas()
    },50)
  },
  renderToCanvas() {
    console.log(this.widget)
    const { getPosterImage } = require('./demo.js')
    getPosterImage(app.globalData.posterId)
    console.log(app.globalData)
    setTimeout(()=>{
      let wxml = app.globalData.wxml;
      let style = app.globalData.style;
      const p1 = this.widget.renderToCanvas({ wxml, style })
      p1.then((res) => {
        this.container = res
        console.log('zzzzz')
        console.log(res)
      }).catch(err=>{
        console.log("errrrrrrrr")
        console.log(err)
        wx.showModal({
          title:"提示",
          content:"生成海报失败，请稍后尝试！",
          showCancel:false,
          success:function(res){
            console.log(res)
            if(res.confirm){
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      })
    },2000)
  },
  extraImage() {
    let that = this
    const p2 = this.widget.canvasToTempFilePath({
      canvasId: 'canvas',
      success: function(res) {
        this.saveImageToPhotos(res.tempFilePath);
      },
      fail: function(res) {
        wx.showToast({
          title: '图片生成失败',
          icon: 'none',
          duration: 2000
        })
      }
    },this)
    p2.then(res => {
      // this.setData({
      //   src: res.tempFilePath,
      //   width: this.container.layoutBox.width,
      //   height: this.container.layoutBox.height
      // })
      wx.saveImageToPhotosAlbum({
        filePath:res.tempFilePath,
        success(res) {
        }
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.classroom_name,
      path: '/pages/class/classDetail/classDetail?id=' + app.globalData.posterId,
      imageUrl:''
    }
  }
})
