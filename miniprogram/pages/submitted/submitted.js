// miniprogram/home/home.js
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
    comments: [],
    commentIndex: 0,
    showComments: false,
    touchStart: undefined,
    commentsTouchStart: undefined,
    commentContent: '',
    pageIndex: 0,
    pages: [],
    color: undefined
  },

  onLoadPage: function (page) {
    console.log(page)
    db.collection('comments').where({
      page_id: page._id
    }).get().then(res => {
      console.log(res)
      this.setData({
        commentCount: res.data.length,
        comments: res.data,
        color: page.color,
        likeCount: page.likes,
        pageContent: page.page_content
      })
    }).catch(err => {
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.page_id)
    this.setData({
      // TODO
      pageId: options.page_id
    })
    const db = wx.cloud.database()
    console.log(getApp().globalData.openid)
    db.collection('pages').where({
      _openid: getApp().globalData.openid
    }).orderBy('publish_time', 'desc').get({
      success: (res) => {
        console.log(res)
        this.setData({
          pages: res.data,
          pageIndex: 0
        })
        this.onLoadPage(res.data[0])
      },
      fail: (err) => {
      }
    })
  },
  viewComment: function () {
    console.log('view comments')
    if (this.data.commentCount === 0) {
      console.log('nothing to view; return;')
      return 
    }
    this.setData({
      showComments: true,
      commentContent: this.data.comments[this.data.commentIndex].comment_content
    })
  },
  closeComment: function () {
    console.log(arguments);
    this.setData({
      showComments: false,
      commentContent: ''
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
    } else if (action == 'LEFT') {
      if (this.data.pageIndex - 1 >= 0){
        this.onLoadPage(this.data.pages[this.data.pageIndex - 1])
        this.setData({
          pageIndex: this.data.pageIndex - 1
        })
      }
    } else if (action == 'RIGHT') {
      if (this.data.pageIndex + 1 > this.data.pages.length - 5) {
        db.collection('pages').where({
          _openid: getApp().globalData.openid
        }).orderBy('publish_time', 'desc')
          .skip(this.data.pages.length).get().then(res => {
          console.log(res)
          this.setData({ 
            pages: this.data.pages.concat(res.data)
          })
        })
      }
      
      if (this.data.pageIndex + 1 < this.data.pages.length) {
        this.onLoadPage(this.data.pages[this.data.pageIndex + 1])
        this.setData({
          pageIndex: this.data.pageIndex + 1
        })
      }
    }
  },
  onCommentsTouchStart: function (event) {
    console.log(tapStart)
    this.setData({
      onCommentsTouchStart: event.touches[0]
    })
  },
  onCommentsTouchEnd: function (event) {
    let touchEnd = event.changedTouches[0];
    let action = getSlideDirection(this.data.touchStart, touchEnd);
    if (action === 'LEFT') {
      if (commentIndex + 1 < comment.length) {
        this.setData({
          commentIndex: this.data.commentIndex + 1,
          commentContent: this.data.comments[this.data.commentIndex + 1].comment_content
        })
      }
    } else if (action == 'RIGHT') {
      if (commentIndex - 1 > 0) {
        this.setData({
          commentIndex: this.data.commentIndex - 1,
          commentContent: this.data.comments[this.data.commentIndex - 1].comment_content
        })
      }
    }
  },
  doNothing: function () {
    console.log('do nothing')
  },
  goOthersPages: function () {
    wx.navigateTo({
      url: '../others/pages'
    })
  }
})