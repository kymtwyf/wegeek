// require( '../iconfont.js')
// miniprogram/pages/test/test.js
Page({
  data: {
    avatarUrl: '../test/wish1.png',
    agree: false,
    agreeNum: 1,
    comment:false,
    commetNum:0,
    bar_Height: wx.getSystemInfoSync().statusBarHeight
    // wishList: [
    //   {
    //     img: '../test/wish1.png',
    //     dzzs: '22',
    //     collected: 1,
    //     id: 1
    //   },
    //   {
    //     img: '../test/wish2.png',
    //     dzzs: '33',
    //     collected: 0,
    //     id: 2
    //   }
    // ],
  },
  onCollectionTap: function (event) {
    let stat 
    let cnt
    if (!this.data.agree) {
      stat = !this.data.agree
      cnt = this.data.agreeNum + 1
    } else if (this.data.agree) {
      stat = !this.data.agree
      cnt = this.data.agreeNum - 1
    }
    this.setData({
      agree: stat,
      agreeNum : cnt
    })
  },
  toComment: function (event) {
    let stat
    let cnt
    if (!this.data.comment) {
      stat = !this.data.comment
      cnt = this.data.commetNum + 1
    } else if (this.data.comment) {
      stat = !this.data.comment
      cnt = this.data.commetNum - 1
    }
    this.setData({
      comment: stat,
      commetNum: cnt
    })
  },


  bindReplaceInput: function (e) {
    // console.log(this.data.inputText)
    var value = e.detail.value
    var pos = e.detail.cursor
    var left
    if (pos !== -1) {
      // 光标在中间
      left = e.detail.value.slice(0, pos)
      // 计算光标的位置
      pos = left.replace(/11/g, '2').length
    }
    

    // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/11/g, '2'),
      cursor: pos
    }

    // 或者直接返回字符串,光标在最后边
    // return value.replace(/11/g,'2'),
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // agree: false
    // let list = [{
    //   agree: false,
    //   agreeNum: 1
    // }
    // ]
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