Page({
  data: {
    //存储计时器
    setInter: '',
    num: 1,
  },
  onLoad: function () {
    var that = this;

  },
  startSetInter: function () {
    var that = this;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function () {
        var numVal = that.data.num + 1;
        that.setData({ num: numVal });
        console.log('setInterval==' + that.data.num);
      }
      , 2000);
  },
  endSetInter: function () {
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
  },
  onHide: function () {

  },
  onUnload: function () {
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
  },

})