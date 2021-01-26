let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data:{
        enter:'',
        show:false,
        phone:{},
        person:{}
    },
    // 按钮点击获取用户手机号
    getPhoneNumber(e) {
        let msg = e.detail.errMsg;
        if(msg==='getPhoneNumber:ok'){
            that.setData({
                phone:e
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
            that.setData({
                person:e
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '需要通过授权才能继续，请重新点击并授权！'
            })
        }
    },
    // 微信login API
    wxLogin(){
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
    // 后台login API
    requestLogin(session_key,open_id,encryptedData,iv,wx_nickname,wx_avatar){
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
    getAuthMe(token){
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.enter) {
            this.setData({
                enter: options.enter
            })
        }
    }
})