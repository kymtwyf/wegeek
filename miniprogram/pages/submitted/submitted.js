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
    showWelcome: false,
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    pageId: '',
    pageContent: '',
    likeCount: 0,
    commentCount: 0,
    showComments: false,
    touchStart: undefined,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.page_id)
    this.setData({
      pageId: options.page_id
    })
    const db = wx.cloud.database()
    db.collection('pages').where({
      _id: options.page_id
    }).get({
      success: (res) => {
        console.log(res)
        this.setData({
          pageContent: res.data[0].page_content
        })
      },
      fail: (err) => {
        wx.showToast({
          icon: 'none',
          title: '查询pages 记录失败' + err
        })
      }
    })
  },
  viewComment: function () {
    console.log('catch tap')
    this.setData({
      showComments: true
    })
  },
  closeComment: function () {
    this.setData({
      showComments: false
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
  onTouchStart: function (event) {
    this.setData({
      touchStart: event.touches[0]
    })
  },
  onTouchEnd: function (event) {
    let touchEnd = event.changedTouches[0];
    let action = getSlideDirection(this.data.touchStart, touchEnd);
    if (action === 'UP') {
      console.log('go my book page')
      wx.navigateTo({
        url: '../myBook/myBook'
      })
    }
  }
})