// miniprogram/home/home.js
const app = getApp()
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
// 获取数据库引用
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentText: '',
  },

  streamRecord: function () {
    manager.start({
      lang: 'zh_CN',
    })
  },

  streamRecordEnd: function () {
    manager.stop()
  },

  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let text = res.result
      this.setData({
        currentText: text,
      })
    }
    // 识别结束事件
    manager.onStop = (res) => {
      let text = res.result
      if (text == '') {
        // 用户没有说话，可以做一下提示处理...
        return
      }
      this.setData({
        currentText: text,
      })
    }
  },

  submitData: function() {
    console.log("start to submit data" + this.data.currentText)
    db.collection("pages").add({
      data: {
        page_content: this.data.currentText
      }
    })
    .then(res => {
      console.log(res)
      let page_id = res['_id']
      wx.navigateTo({
        url: '../submitted/submitted?page_id=' + page_id
      })
      // db.collection("user_info").add({
      //   data: {
      //     page_id: page_id
      //   },
      //   success(res) {
      //     console.log(res)
      //   }
      // })
    })
  },

  bindEquipmentId: function (e) {
    console.log(e.detail.value)
    this.setData({
      currentText: e.detail.value
    })
  },

  bindTextAreaBlur: function(e) {
    console.log(e.detail.value)
    this.setData({
      currentText: e.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initRecord()
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