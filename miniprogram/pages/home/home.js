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
    showWelcome: true,
    currentText: '',
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    setSubmit:false,
    setRecord:false
  },

  streamRecord: function () {
    this.setData({
      setRecord: true,
    })
    manager.start({
      lang: 'zh_CN',
    })
  },

  streamRecordEnd: function () {
    manager.stop()
    this.setData({
      setRecord: false,
    })
  },

  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let text = res.result
      this.setData({
        currentText: this.data.currentText + "\n" + text
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
        currentText: this.data.currentText + "\n" + text,
      })
    }
  },

  submitData: function() {
    if (!this.data.currentText || this.data.currentText.length === 0) {
      wx.showToast({
        title: '此时锦言胜无言',
        icon: 'none'
      })
      return
    }
    this.setData({
      setSubmit: true
    })      
    console.log("start to submit data " + this.data.currentText)
    wx.cloud.callFunction({
      name: 'submitData',
      data: {
        page_content: this.data.currentText,
        publish_time: Date.parse(new Date()) / 1000
      },
      success: res => {
        console.log(res);
        res = JSON.parse(res.result);
        console.log(res);
        let page_id = res['_id']
        wx.navigateTo({
          url: '../submitted/submitted?page_id=' + page_id
        })
      }
    });
    return;
    db.collection("pages").add({
      data: {
        page_content: this.data.currentText,
        publish_time: Date.parse(new Date())/1000
      },
    })
    .then(res => {
      console.log(res)
      let page_id = res['_id']
      wx.navigateTo({
        url: '../submitted/submitted?page_id=' + page_id
      })
      this.setData({
        setSubmit: false
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

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
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
    const _this = this
    setTimeout(function () {
      _this.setData({
        showWelcome: false
      })
    }, 1000);
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