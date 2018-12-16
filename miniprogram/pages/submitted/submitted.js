// miniprogram/home/home.js
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
// 获取数据库引用
const db = wx.cloud.database()
import { getSlideDirection } from '../utils';

function currentDate() {
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '年' + m + '月' + d + '日';
};

function formatDateTime(timeStamp) {
  var date = new Date();
  date.setTime(timeStamp * 1000);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '年' + m + '月' + d + '日';
};

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
    color: undefined,
    fromPage: 'desc',
    reverse: 'desc'
  },

  onLoadPage: function (page) {
    //console.log(page)
    db.collection('comments').where({
      page_id: page._id
    }).get().then(res => {
      //console.log(res)
      this.setData({
        commentCount: res.data.length,
        comments: res.data,
        color: page.color,
        likeCount: page.likes || 0,
        pageContent: page.page_content + '\n\t\t\t\t\t' + currentDate() 
      })
    }).catch(err => {
    })
  },
  smartNavigate: function (route) {
    var pages = getCurrentPages()
    for (var i = 0; i < pages.length; i++) {
      //console.log(pages[i])
      if (pages[i].route === route) {
        wx.navigateBack({
          delta: pages.length - i
        })
        break
      }
    }
    if (i == pages.length) {
      route = '/' + route
      wx.navigateTo({
        url: route
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    this.setData({
      fromPage: options.from_uri || '',
      reverse: options.reverse || 'desc'
    })
    const db = wx.cloud.database()
    //console.log(getApp().globalData.openid)
    db.collection('pages').where({
      _openid: getApp().globalData.openid
    }).orderBy('publish_time', this.data.reverse).get({
      success: (res) => {
        //console.log(res)
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
  backHome: function () {
    this.smartNavigate('pages/home/home')
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
    //console.log(arguments);
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
      this.smartNavigate('pages/myBook/myBook')
    } else if ((action == 'LEFT' && this.data.reverse == "desc") || (action == 'RIGHT' && this.data.reverse == 'asc')) {
      //console.log(this.data.fromPage)
      if (this.data.pageIndex - 1 >= 0){
        this.onLoadPage(this.data.pages[this.data.pageIndex - 1])
        this.setData({
          pageIndex: this.data.pageIndex - 1
        })
      } else {
        this.smartNavigate('pages/home/home')
      }
    } else if ((action == 'RIGHT' && this.data.reverse == "desc") || (action == 'LEFT' && this.data.reverse == 'asc')) {
      if (this.data.pageIndex + 1 > this.data.pages.length - 5) {
        db.collection('pages').where({
          _openid: getApp().globalData.openid
        }).orderBy('publish_time', this.data.reverse)
          .skip(this.data.pages.length).get().then(res => {
          //console.log(res)
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
      } else {
        wx.showToast({
          title: '已经到底咯',
          duration: 1000
        })
      }
    }
  },
  onCommentsTouchStart: function (event) {
    //console.log(tapStart)
    this.setData({
      onCommentsTouchStart: event.touches[0]
    })
  },
  onCommentsTouchEnd: function (event) {
    console.log("comments touch end");
    let touchEnd = event.changedTouches[0];
    let action = getSlideDirection(this.data.touchStart, touchEnd);
    if (action === 'LEFT') {
      if (this.data.commentIndex + 1 < this.data.comments.length) {
        this.setData({
          commentIndex: this.data.commentIndex + 1,
          commentContent: this.data.comments[this.data.commentIndex + 1].comment_content
        })
      }
    } else if (action == 'RIGHT') {
      if (this.data.commentIndex - 1 >= 0) {
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
    this.smartNavigate('pages/submitted/others')
  }
})