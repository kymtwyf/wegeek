var app = getApp()
// miniprogram/pages/others/pages.js
import { getSlideDirection } from '../utils';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    viewAllOthers: true, // 看所有人的书页 false 表示只看一个人的书
    pageContent: '',
    pageIndex: 0,
    pages: [],
    touchStart: undefined,
    exclude: []
  },

  onPageLoad: function (page) {
    this.setData({
      pageContent: page.page_content,
      color: page.color
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'dispatchPages',
      data: {
        openid: app.globalData.openid,
        exclude: this.data.exclude
      },
      success: res => {
        console.log(res)
        var result = JSON.parse(res.result)
        this.data.pages = result
        this.data.pageIndex = 0
        for (var i = 0; i < result.length; i++) {
          console.log(result[i])
          this.data.exclude.push(result[i]._id)
        }
        console.log(this.data.exclude)
        this.onPageLoad(result[0])
      }
    });
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

    if (action === 'RIGHT' ){
      if (this.data.pageIndex - 1 >= 0) {
        this.onPageLoad(this.data.pages[this.data.pageIndex - 1])
        this.data.pageIndex = this.data.pageIndex - 1
      }
    } else if( action === 'LEFT') {
      if (this.data.pageIndex + 1 > this.data.pages.length - 5) {
        wx.cloud.callFunction({
          name: 'dispatchPages',
          data: {
            openid: app.globalData.openid,
            exclude: this.data.exclude
          },
          success: res => {
            console.log(res)
            var result = JSON.parse(res.result)
            for (var i = 0; i < result.length; i++) {
              console.log(result[i])
              this.data.exclude.push(result[i]._id)
            }
            console.log(this.data.exclude)
            this.data.pages = this.data.pages.concat(result)
          }
        });
      }
      if (this.data.pageIndex + 1 < this.data.pages.length) {
        this.onPageLoad(this.data.pages[this.data.pageIndex + 1])
        this.data.pageIndex = this.data.pageIndex + 1
      }
    }

  }

})