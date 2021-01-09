var app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    commentValue:"",
    commentPanelShow:false,
    index:0,
    id:0,
    dynamicList:[],
    currentImage: 0,
    imgUrls: [],
    show: false,
    page:1
  },
  //转发
  onShareAppMessage:function(event){
    return {
      // title:"",
      // path: "/pages/dynamic/dynamic",
      // imageUrl:"",
      success:function(res){
        console.log(res)
      },
      fail:function(err){
        console.log(err)
      }
    }
  },
  //监听评论input值
  bindinput:function(e){
    console.log(e)
    this.setData({
      commentValue:e.detail.value
    })
  },
  //创建评论
  createComment:function(e){
    var token = wx.getStorageSync("token")
    if(token){
      var index = e.currentTarget.dataset.index
      var id = e.currentTarget.dataset.id
      this.setData({
        index: index,
        id: id
      })
      this.setData({
        commentPanelShow: !this.data.commentPanelShow
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
    
  },
  //发送评论
  sendComment:function(event){
    var that = this
    var token = wx.getStorageSync("token")
    var nickname = wx.getStorageSync("nickname")
    var index = this.data.index
    var id = this.data.id
    var commentValue = this.data.commentValue
    var key = 'dynamicList[' + index + '].comments'
    if(commentValue==""){
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: '留言不能为空！'  
      })
    }else{
      wx.request({
        url: app.globalData.studentBase +'/api/user/comment',
        method:"POST",
        header:{
          Authorization:token
        },
        data:{
          comment:commentValue,
          key_type:1,
          key_id:id
        },
        success:function(res){
          console.log(res)
          if(res.data.status_code==401){
            wx.navigateTo({
              url: '/pages/login/login'
            })
            return
          }
          that.data.dynamicList[index].comments.unshift({
            nickname: nickname,
            comment: that.data.commentValue
          })
          that.setData({
            [key]: that.data.dynamicList[index].comments,
            commentPanelShow: !that.data.commentPanelShow
          })
          if(res.data.score.offset){
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: '留言成功！新增' + res.data.score.offset + '积分'  
            })
          }
        }
      })
    }
    
  },
  //动态列表
  getDynamicList: function (page) {
    wx.showToast({
      icon: 'loading',
      duration:160000
    })
    var that = this
    wx.request({
      url: app.globalData.studentBase + '/api/dynamics',
      method: "POST",
      // header: {
      //   Authorization: token
      // },
      data:{
        page:page
      },
      success: function (res) {
        console.log(res)
        if(res.data.status_code==401){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        that.data.dynamicList = that.data.dynamicList.concat(res.data.data)
        that.setData({
          dynamicList: that.data.dynamicList
        })
        wx.hideToast()
      }
    })
  },
  //预览图片
  previewImg: function (event) {
    var current = event.currentTarget.dataset.current
    var list = event.currentTarget.dataset.list
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDynamicList(this.data.page)
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
    wx.showToast({
      icon: "loading",
      duration:150000
    })
    this.data.page++
    this.getDynamicList(this.data.page)
  }
})