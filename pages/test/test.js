const ctx = wx.createCanvasContext('myCanvas')
Page({
  data: {
    canvasScale: 1.0, // 画布放大倍数
    show: false,
    marginLeft: '-10000px',
    src: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1360768835,3539735442&fm=26&gp=0.jpg",
    codeSrc: "/images/wechat-code.png"
  },
  onLoad: function() {

  },
  //初始化设备信息、画布信息
  productCanvas: function() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        //console.log(res)
        var scale = res.windowWidth / 375
        var width = scale * 350
        var height = scale * 500
        that.setData({
          scale: scale,
          width: width,
          height: height,
          marginLeft: -width / 2 + 'px',
          marginTop: -(height + 30) / 2 + 'px'
        })
        that.drawCanvas()
      }
    })
  },
  //绘画
  drawCanvas: function() {
    var that = this
    var scale = that.data.scale
    wx.getImageInfo({
      src: that.data.src,
      complete: (res) => {
        var imgPath = res.path
        console.log(res.path)
        //绘制图片
        ctx.drawImage(imgPath, 10 * scale, 10 * scale, 330 * scale, 400 * scale)
        //绘制二维码
        ctx.drawImage(that.data.codeSrc, 290 * scale, 420 * scale, 50 * scale, 50 * scale)
        ctx.draw()
      }
    })

  },
  //生成海报
  submit: function() {
    this.setData({
      show: true
    })
    this.productCanvas()
   
  },
  //关闭海报分享
  canvasDelete: function() {
    this.setData({
      marginLeft: "-10000px",
      show: false
    })
  }, // 保存图片
  saveImage() {
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.width * that.data.canvasScale,
      height: that.data.height * that.data.canvasScale,
      canvasId: 'myCanvas',
      success: function(res) {
        that.saveImageToPhotos(res.tempFilePath);
      },
      fail: function(res) {
        wx.showToast({
          title: '图片生成失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  saveImageToPhotos: function(tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success(result) {
        wx.showToast({
          title: '保存成功，从相册中分享到朋友圈吧',
          icon: 'none',
          duration: 4000
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '图片保存失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //分享
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    // return {
    //   title: '自定义转发标题',
    //   path: '/page/user?id=123',
    //   imageUrl:""
    // }
  }
})