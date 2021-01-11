var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster:"",
    width:0,
    height:0,
    pixelRatio:1,
    options:{
      backImage:""
    }
  },
    /**
   * 画图
   */
  drawImage (canvasAttrs,options) {
    let ctx = wx.createCanvasContext('canvasPoster', this)
    let canvasW = canvasAttrs.width // 画布的真实宽度
    let canvasH = canvasAttrs.height //画布的真实高度
    // 头像和二维码大小都需要在规定大小的基础上放大像素比的比例后面都会 *this.data.pixelRatio
    let headerW = 48 * this.data.pixelRatio
    let headerX = (canvasW - headerW) / 2
    let headerY = 40 * this.data.pixelRatio
    let qrcodeW = 73 * this.data.pixelRatio
    let qrcodeX = 216 * this.data.pixelRatio
    let qrcodeY = 400 * this.data.pixelRatio
    // 填充背景
    wx.getImageInfo({
      src: options.backImage,
      complete: (res) => {
        var path = res.path;
        ctx.drawImage(path, 0, 0, canvasW, canvasH)
    ctx.save()
    // 控制头像为圆形
    ctx.setStrokeStyle('rgba(0,0,0,.2)') //设置线条颜色，如果不设置默认是黑色，头像四周会出现黑边框
    ctx.arc(headerX + headerW / 2, headerY + headerW / 2, headerW / 2, 0, 2 * Math.PI)
    ctx.stroke()
    //画完之后执行clip()方法，否则不会出现圆形效果
    ctx.clip()
    // 将头像画到画布上
    // ctx.drawImage(this.shareInfo.headerImg, headerX, headerY, headerW, headerW)
    // ctx.restore()
    // ctx.save()
    // 绘制二维码
    // ctx.drawImage(this.shareInfo.qrcode, qrcodeX, qrcodeY, qrcodeW, qrcodeW)
    // ctx.save()
    // ctx.draw()
    setTimeout(() => {
      //下面的13以及减26推测是因为在写样式的时候写了固定的zoom: 50%而没有用像素比缩放导致的黑边，所以在生成时进行了适当的缩小生成，这个大家可以自行尝试
      wx.canvasToTempFilePath({
        canvasId: 'canvasPoster',
        x: 13,
        y: 13,
        width: canvasW - 26,
        height: canvasH - 26,
        destWidth: canvasW - 26,
        destHeight: canvasH - 26,
        success: (res) => {
          this.poster = res.tempFilePath
        }
      })
    }, 200)
      }
    })
    
  },
  previewImg () {
    if (this.poster) {
      //预览图片，预览后可长按保存或者分享给朋友
      wx.previewImage({
        urls: [this.poster]
      })
    }
  },
  savePoster () {
    if (this.poster) {
      wx.saveImageToPhotosAlbum({
        filePath: this.poster,
        success: (result) => {
          wx.showToast({
            title: '海报已保存，快去分享给好友吧。',
            icon: 'none'
          })
        }
      })
    }
  },
  /**
   * 生成海报
   */
  makePoster:function(){
    var query = wx.createSelectorQuery()
    var that = this
    query.select('#canvasPoster').boundingClientRect((res) => {
      // 返回值包括画布的实际宽高
      this.drawImage(res,that.data.options)
    }).exec()
  },
  /**
   * 获取设备尺寸
   */
  getScreenSize:function(){
    var that = this;
    wx.getSystemInfo({
      success (res) {
        // 通过像素比计算出画布的实际大小（330x490）是展示的出来的大小
        that.setData({
          width:330 * res.pixelRatio,
          height:490 * res.pixelRatio,
          pixelRatio:res.pixelRatio
        })
        that.getPosterData(that.data.id)
      }
    })
  },
  /**
   * 获取海报图片
   */
  getPosterData:function(id){
    var token = wx.getStorageSync("token");
    var that = this
    wx.request({
      url: app.globalData.studentBase +'/api/classroom/hb',
      method:"POST",
      header:{
        Authorization:token
      },
      data:{
        classroom_id:id
      },
      success:function(res){
        if(res.data.code==200 && res.data.data.hb){
          that.setData({
            options:{
              backImage:res.data.data.hb
            }
          })
          that.makePoster();
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id:id
    })
    this.getScreenSize()
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