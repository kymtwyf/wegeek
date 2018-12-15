// miniprogram/pages/others/pages.js
import { getSlideDirection } from '../utils';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    viewAllOthers: true, // 看所有人的书页 false 表示只看一个人的书
    pageContent: 'abcabc',
    touchStart: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  tapped () {
    if (this.data.viewAllOthers) {
      this.setData({
        viewAllOthers: false
      })
    }
  },
  onTouchStart (event) {
    this.setData({
      touchStart: event.touches[0]
    })
  },
  onTouchEnd (event) {
   let touchEnd = event.changedTouches[0];
    let action = getSlideDirection(this.data.touchStart, touchEnd);
    
    if (action === 'DOWN') {
      wx.navigateTo({
        url: '../submitted/submitted?from_uri=others&reverse=desc'
      })
    }

    if (action === 'LEFT' || action === 'RIGHT') {
      // TODO: GO NEXT PAGE
      if (this.data.viewAllOthers) {
      // TODO: 去所有人的

      } else {
      // TODO: 只去一个人的
        
      }
    }

  }

})