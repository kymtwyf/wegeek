// miniprogram/home/home.js
const app = getApp()
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
// 获取数据库引用
const db = wx.cloud.database()

import { getSlideDirection } from '../utils';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showWelcome: true,
    currentText: '',
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    setSubmit:false,
    setRecord:false,
    touchStart: undefined
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

    }
    // 识别结束事件
    manager.onStop = (res) => {
      let text = res.result
      if (text == '') {
        // 用户没有说话，可以做一下提示处理...
        return
      }
      let union_data = this.data.currentText;
      if (union_data == '') {
        union_data = text;
      } else {
        union_data = union_data + "\n" +text;
      }
      this.setData({
        currentText: union_data,
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
        openid: app.globalData.openid,
        page_content: this.data.currentText,
        publish_time: Date.parse(new Date()) / 1000,
        likes: 0
      },
      success: res => {
        console.log(res);
        res = JSON.parse(res.result);
        console.log(res);
        this.setData({
          currentText: '',
          setSubmit: false
        })
        wx.navigateTo({
          url: '../submitted/submitted?reverse=desc&from_uri=root'
        })
      }
    });
    return;
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

  },
  onTouchStart(event) {
    this.setData({
      touchStart: event.touches[0]
    })
  },
  onTouchEnd(event) {
    let touchEnd = event.changedTouches[0];
    let action = getSlideDirection(this.data.touchStart, touchEnd);

    if (action === 'RIGHT') {
      wx.navigateTo({
        url: '../submitted/submitted?from_uri=root&reverse=desc'
      })
    }

  }
})