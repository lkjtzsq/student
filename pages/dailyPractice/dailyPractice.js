const RecorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "",
    show: false,
    question: "",
    path: "",
    audioFilePath: "",
    audioStatus: false,
    videoSrc: "",
    audioPath: "",
    videoPath: "",
    recordStatus: false,
    recordSeconds: 0,
    recordSecondsToHs:'00:00',
    recordPanel: false,
    setInter: '',
    audioStartStatus: true,
    recordPlay: true,
    holeTime:'',
    currentTime:'00:00',
    recordPlayInter:''
  },
  s_to_hs(s){
    //计算分钟
    //算法：将秒数除以60，然后下舍入，既得到分钟数
    var h;
    h  =   Math.floor(s / 60);
    //计算秒
    //算法：取得秒%60的余数，既得到秒数
    s  =   s % 60;
    //将变量转换为字符串
    h    += '';
    s    += '';
    //如果只有一位数，前面增加一个0
    h  =   (h.length == 1) ? '0' + h : h;
    s  =   (s.length == 1) ? '0' + s : s;
    return h + ':' + s;
  },
  //录音定时器
  setInterOn: function() {
    var that = this
    that.data.setInter = setInterval(function() {
      that.data.recordSeconds++
      that.data.recordSecondsToHs = that.s_to_hs(that.data.recordSeconds)
        that.setData({
          recordSeconds: that.data.recordSeconds,
          recordSecondsToHs: that.data.recordSecondsToHs
        })
    }, 1000)
  },
  //录音定时器
  setRecordPlay: function () {
    var that = this
    clearInterval(that.data.recordPlayInter)
    that.data.recordPlayInter = setInterval(function () {
      var currentTime = Math.ceil(innerAudioContext.currentTime) 
      that.data.currentTime = that.s_to_hs(currentTime)
      that.setData({
        currentTime: that.data.currentTime
      })
    }, 1000)
  },
  //录音继续
  resume: function() {
    RecorderManager.resume()
  },
  //录音开始函数
  startRecord: function() {
    var that = this
    const options = {
      duration: 60000, //指定录音的时长，单位 ms
      // sampleRate: 16000, //采样率
      // numberOfChannels: 1, //录音通道数
      // encodeBitRate: 96000, //编码码率
      format: 'mp3' //音频格式，有效值 aac/mp3
      // frameSize: 50, //指`定帧大小，单位 KB
    }
    //开始录音
    RecorderManager.start(options);
    RecorderManager.onStart(() => {
      clearInterval(that.data.setInter)
      that.setInterOn()
      that.setData({
        audioStatus: true,
        // recordSeconds: 0,
        recordPanel: true,
        recordStatus: false,
        audioStartStatus: false
      })
    });
    RecorderManager.onPause(function() {
      clearInterval(that.data.setInter)
      that.setData({
        audioStatus: false,
        recordStatus: true
      })
    })
    RecorderManager.onResume(function() {
      that.setInterOn()
      that.setData({
        audioStatus: true,
        recordStatus: false
      })
    })
    RecorderManager.onStop((res) => {
      clearInterval(that.data.setInter)
      if(!that.data.audioSrc){
        that.setData({
          audioSrc: res.tempFilePath,
          audioStartStatus: true,
          recordPanel: false,
          recordSeconds: 0,
          recordSecondsToHs: '00:00',
          currentTime: '00:00'
        })
        this.uploadMedia(res.tempFilePath, "audio")
        innerAudioContext.src = res.tempFilePath
        innerAudioContext.onCanplay(() => {
          // 必须。可以当做是初始化时长
          innerAudioContext.duration;
          // 必须。不然也获取不到时长
          setTimeout(() => {
            that.setData({
              holeTime: that.s_to_hs(Math.floor(innerAudioContext.duration))
            })
          }, 50)
        }) 
      }
    })
    //错误回调
    RecorderManager.onError((res) => {
    })
  },
  //开始录音的时候
  start: function() {
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              that.startRecord()
            },
            fail(res) {
            }
          })
        } else {
          that.startRecord()
        }
      }
    })

  },
  //暂停录音
  pause: function() {
    RecorderManager.pause();
  },
  //完成录音
  finish: function() {
    var that = this
    this.setData({
      audioSrc:""
    })
    RecorderManager.stop()
    this.setData({
      recordPanel: false,
      audioStartStatus: true,
      recordPlay:true
    })
  },
  //停止录音
  stop: function() {
    var that = this
    clearInterval(that.data.setInter)
    RecorderManager.stop();
  },
  //播放声音
  play: function() {
    var that = this
    that.setData({
      recordPlay: false
    })
    innerAudioContext.play()
    // innerAudioContext.autoplay = true
    // innerAudioContext.src = this.data.audioSrc
    innerAudioContext.onPlay(() => {
      that.setRecordPlay()
    })
    innerAudioContext.onPause(() => {
      clearInterval(that.data.recordPlayInter)
    })
    innerAudioContext.onEnded(() => {
      clearInterval(that.data.recordPlayInter)
      this.setData({
        recordPlay: true,
        currentTime: '00:00'
      })
    })
    innerAudioContext.onError((res) => {
    })
  },
  //删除录音
  deleteRecordShow: function() {
    this.setData({
      recordPlay: true,
      audioSrc: "",
      audioPath: "",
      recordSeconds: 0,
      recordSecondsToHs: '00:00',
      holeTime:''
    })
    innerAudioContext.stop()
  },
  //暂停播放声音
  recordPause: function() {
    this.setData({
      recordPlay: true
    })
    innerAudioContext.pause()
  },
  //选择视频
  chooseVideo: function(event) {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        that.setData({
          videoSrc: res.tempFilePath
        })
        that.uploadMedia(res.tempFilePath, "video")
      }
    })
  },
  //获取题目
  getQuestion: function() {
    var that = this
    var token = wx.getStorageSync("token")
    if (token) {
      wx.request({
        url: app.globalData.studentBase + '/api/user/practice',
        method: "POST",
        header: {
          Authorization: token
        },
        success: function(res) {
          if(res.data.status_code==401){
            wx.navigateTo({
              url: '/pages/login/login'
            })
            return
          }
          if (res.data.status_code == 201) {
            that.setData({
              show: false,
              question: res.data.message
            })
          } else {
            var can_answer = res.data.data.can_answer
            var practice_cover = res.data.data.practice_cover
            var practice_id = res.data.data.practice_id
            var practice_title = res.data.data.practice_title
            that.setData({
              question: practice_title,
              practice_id: practice_id,
              practice_cover: practice_cover,
              show: true,
            })
            if (can_answer == 0) {
              that.setData({
                show: false
              })
            }
          }
        }
      })
    }
  },
  //发布打卡
  submit: function(event) {
    var practice_id = this.data.practice_id
    var answer = this.data.path
    var token = wx.getStorageSync("token")
    var answer_mp3 = this.data.audioPath
    var answer_mp4 = this.data.videoPath
    if (!answer) {
      wx.showModal({
        title: '提示',
        content: '请上传答案后再打卡！'
      })
    } else {
      wx.request({
        url: app.globalData.studentBase + '/api/user/practice_submit',
        method: "POST",
        header: {
          'content-type': 'application/json',
          Authorization: token
        },
        data: {
          practice_id: practice_id,
          answer: answer,
          answer_mp3: answer_mp3,
          answer_mp4: answer_mp4
        },
        success: function(res) {
          if(res.data.status_code==401){
            wx.navigateTo({
              url: '/pages/login/login'
            })
            return
          }
          if (res.data.success) {
            wx.showToast({
              title: '打卡成功！'
            })
          }
          if (res.data.status_code == 400) {
            wx.showModal({
              title: '提示',
              content: res.data.message
            })
          }
        },
        fail: function(err) {
        }
      })
    }

  },
  //预览本地图片
  viewImg: function(event) {
    var that = this
    wx.previewImage({
      current: that.data.imgUrl,
      urls: [that.data.imgUrl]
    })
  },
  //删除本地图片
  deleteImg: function(event) {
    this.setData({
      imgUrl: "",
      path: ""
    })
  },
  //删除本地视频
  deleteVideo: function() {
    this.setData({
      videoSrc: "",
      videoPath: ""
    })
  },
  //删除本地录音
  deleteAudio: function() {
    RecorderManager.stop()
    this.setData({
      audioStartStatus: true,
      recordPanel: false,
      recordSeconds: 0,
      recordSecondsToHs: '00:00'
    })
  },
  //从本地选择照片
  choosePic: function(event) {
    var that = this
    wx.showActionSheet({
      itemList: ['拍照', '从相册中选择'],
      success(res) {
        let sourceType = 'camera'
        if (res.tapIndex == 0) {
          sourceType = 'camera'
        } else if (res.tapIndex == 1) {
          sourceType = 'album'
        }
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: [sourceType],
          success: function(res) {
            that.uploadPic(res.tempFilePaths[0])
            that.setData({
              imgUrl: res.tempFilePaths[0]
            })
          },
        })
      },
    })
  },
  //上传照片
  uploadPic: function(imgUrl) {
    var token = wx.getStorageSync("token")
    var that = this
    wx.showToast({
      title: '图片上传中',
      icon: "loading",
      duration: 160000
    })
    if (imgUrl && token) {
      wx.uploadFile({
        url: app.globalData.studentBase + '/api/user/practice_upload_img',
        filePath: imgUrl,
        name: 'upload_file',
        header: {
          "Content-Type": "multipart/form-data",
          'accept': 'application/json',
          Authorization: token
        },
        success(res) {
          var data = JSON.parse(res.data)
          that.setData({
            path: data.data.path
          })
          wx.hideToast()
          wx.showToast({
            title: '图片上传成功'
          })
        }
      })
    }

  },
  //上传视频&音频
  uploadMedia: function(mediaUrl, type) {
    var token = wx.getStorageSync("token")
    var that = this
    if (type == "video") {
      wx.showToast({
        title: '视频上传中',
        icon: 'loading',
        duration: 160000
      })
    }
    if (mediaUrl && token) {
      wx.uploadFile({
        url: app.globalData.studentBase + '/api/user/practice_upload_media',
        filePath: mediaUrl,
        name: 'upload_file',
        header: {
          "Content-Type": "multipart/form-data",
          'accept': 'application/json',
          Authorization: token
        },
        success(res) {
          var data = JSON.parse(res.data)

          if (type == "video") {
            that.setData({
              videoPath: data.data.path
            })
            wx.showToast({
              title: '视频上传成功'
            })
          }

        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getQuestion()
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
    RecorderManager.stop()
    innerAudioContext.stop()
    clearInterval(this.data.setInter)
    clearInterval(this.data.recordPlayInter)
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