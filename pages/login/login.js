let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data:{
    enter:'',      // 入口参数
    show:false,    // 获取手机号&获取用户信息按钮显隐
    phone:{},      // 授权获取用户手机号信息
    person:{},     // 授权获取用户信息
    login:{},      // wx.login信息
    sessionKey:{}, // 获取后台sessionKey信息
    user:{}        // 获取后台用户信息
  },
  // 按钮点击获取用户手机号
  getPhoneNumber(e) {
    let msg = e.detail.errMsg;
    if(msg==='getPhoneNumber:ok'){
      this.setData({
        phone:e,
        show:true
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '需要通过授权才能继续，请重新点击并授权！'
      })
    }
  },
  // 按钮点击获取用户信息
  getPerson(e){
    let msg = e.detail.errMsg;
    if(msg==='getUserInfo:ok'){
      this.setData({
        person:e
      })
      let code = this.data.login.code;
      let encryptedData = this.data.person.detail.encryptedData;
      let iv = this.data.person.detail.iv;
      this.triggerRequestSessionKey(code,encryptedData,iv);
    }else{
      wx.showModal({
        title: '提示',
        content: '需要通过授权才能继续，请重新点击并授权！'
      })
    }
  },
  // 微信login API
  wxLoginAPI(){
    return new Promise((resolve,reject)=>{
      wx.login({
        success(res){
          resolve(res);
        },
        fail(err){
          reject(err);
        }
      })
    })
  },
  // 后台获取session_key API
  requestSessionKeyAPI(code,encryptedData,iv){
    return new Promise((resolve, reject) =>{
      wx.request({
        url: app.globalData.studentBase + '/api/session_key',
        method:"POST",
        data:{
          code,
          encryptedData,
          iv
        },
        success:function(res){
          resolve(res);
        },
        fail(err) {
          reject(err);
        }
      })
    })
  },
  // 后台login API
  requestLoginAPI(session_key,open_id,encryptedData,iv,wx_nickname,wx_avatar){
    return new Promise((resolve, reject) =>{
      wx.request({
        url: app.globalData.studentBase + '/api/login',
        method:"POST",
        data:{
          session_key,
          open_id,
          encryptedData,
          iv,
          wx_nickname,
          wx_avatar,
        },
        success:function(res){
          resolve(res);
        },
        fail(err) {
          reject(err);
        }
      })
    })
  },
  // 后台用户信息 API
  getAuthMeAPI(token){
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.studentBase + '/api/auth/me',
        method: "POST",
        header: {
          Authorization: token
        },
        success(res){
          resolve(res);
        },
        fail(err){
          reject(err);
        }
      })
    })
  },
  /*
  ** 执行wx.login API
  */
  triggerWxLogin(){
    this.wxLoginAPI().then(res=>{
      this.setData({
        login:res
      })
    })
  },
  /*
 ** 执行获取session_key API
 */
  triggerRequestSessionKey(code,encryptedData,iv){
    this.requestSessionKeyAPI(code,encryptedData,iv).then(res=>{
      this.setData({
        sessionKey:res.data.data
      })
      let session_key = this.data.sessionKey.session_key;
      let open_id = this.data.sessionKey.open_id;
      let encryptedData = this.data.phone.detail.encryptedData;
      let iv = this.data.phone.detail.iv;
      let wx_nickname = this.data.sessionKey.wx_nickname;
      let wx_avatar = this.data.sessionKey.wx_avatar;
      this.triggerRequestLogin(session_key,open_id,encryptedData,iv,wx_nickname,wx_avatar);
    })
  },
  /*
  ** 执行获取后台login API
  */
  triggerRequestLogin(session_key,open_id,encryptedData,iv,wx_nickname,wx_avatar){
    this.requestLoginAPI(session_key,open_id,encryptedData,iv,wx_nickname,wx_avatar).then(res=>{
      let token = res.data.token;
      wx.setStorageSync("token",token);
      this.triggerGetAuthMeAPI(token);
    });
  },
  /*
  ** 执行获取后台用户信息 API
  */
  triggerGetAuthMeAPI(token){
    this.getAuthMeAPI(token).then(res=>{
      console.log(res);
      this.setData({
        user:res.data.data
      })
      let nickname = res.data.data.nickname
      let user_cover = res.data.data.user_cover
      let avatar_path = res.data.data.avatar_path ? res.data.data.avatar_path : "https://caishang.5rkk.com/wxxcx/images/icon/user.png";
      let classroom_name = res.data.data.classroom_name
      let birth = res.data.data.birth ? result.data.data.birth:'保密'
      wx.setStorageSync("nickname", nickname)
      wx.setStorageSync("avatar_path", avatar_path)
      wx.setStorageSync("user_cover", user_cover)
      wx.setStorageSync("classroom_name", classroom_name)
      wx.setStorageSync("birth", birth)
      wx.hideToast()
      if (this.data.enter == "footprint") {
        wx.redirectTo({
          url: '/pages/footprint/footprint'
        })
      } else if (this.data.enter == "dailyPractice") {
        wx.redirectTo({
          url: '/pages/dailyPractice/dailyPractice'
        })
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.enter) {
      this.setData({
        enter: options.enter
      })
    }
    this.triggerWxLogin();
  }
})