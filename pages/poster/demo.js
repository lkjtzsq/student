let app = getApp()
let wxml = '';
let style = {
  container: {
    width: 0,
    height: 0,
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  img: {
    width: 0
  }
}
let getPosterImage=function(id){
  wx.request({
    url: `${app.globalData.studentBase}/api/classroom/hb`,
    method:"POST",
    data:{
      classroom_id:id
    },
    success(res){
      if(res.data.code==200 && res.data.data.hb){
        let hb = res.data.data.hb;
        console.log(hb)
        wx.getImageInfo({
          src: hb,
          success (res) {
            let imageWidth = res.width;
            let imageHeight = res.height;
            wx.getSystemInfo({
              success: function(res) {
                let width = res.windowWidth
                style.container.width=style.img.width=width
                style.container.height=style.img.height=imageHeight*(width/imageWidth)
                app.globalData.wxml = wxml
                app.globalData.style = style
              }
            })
          }
        })
        wxml = `
        <view class="container">
              <image class="img" src="${hb}"></image>
        </view>
        `
      }
    },
    fail(err){
      console.log(err)
    }
  })
}
getPosterImage()
module.exports = {
  getPosterImage
}


