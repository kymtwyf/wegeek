// miniprogram/home/home.js
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
// 获取数据库引用
const db = wx.cloud.database()
import { getSlideDirection } from '../utils';
const app = getApp();
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
    reverse: 'desc',

    exclude: [],
    othersOpenId: undefined,
    viewAllOthers: true,
    currentPage: undefined,

    commenting: false, //正在评论别人
    commentText: undefined,// 评论别人的文字
    liked: false,
  },
  viewOnes: function () {
    const db = wx.cloud.database()
    db.collection('pages').where({
      _openid: this.data.othersOpenId
    }).orderBy('publish_time', this.data.reverse).get({
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
  onLoadPage: function (page) {
    console.log(page)
    db.collection('comments').where({
      page_id: page._id
    }).get().then(res => {
      console.log(res)
      this.setData({
        currentPage: page, 
        commentCount: res.data.length,
        comments: res.data,
        color: page.color,
        likeCount: page.likes || 0,
        pageContent: page.page_content + '\n\t\t\t\t\t' + currentDate() 
      })
    }).catch(err => {
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    // console.log(options)
    // this.setData({
    //   fromPage: options.from_uri,
    //   reverse: options.reverse
    // })
    const db = wx.cloud.database()
    const _this = this
    if (!app.globalData.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
          console.log('get openid' + app.globalData.openid + ' requesting data again');
          _this.onLoad()
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    } else {
      wx.cloud.callFunction({
        name: 'dispatchPages',
        data: {
          openid: app.globalData.openid,
          exclude: this.data.exclude
        },
        success: res => {
          var result = JSON.parse(res.result)
          console.log('dispatched pages')
          console.log(result)
          this.data.pages = result
          this.data.pageIndex = 0
          // 我们看过之后再加 exclude
          // for (var i = 0; i < result.length; i++) {
          //   console.log(result[i])
          //   this.data.exclude.push(result[i]._id)
          // }
          // console.log(this.data.exclude)
          this.onLoadPage(result[0])
        }
      });
    }
    
  },
  backHome: function () {
    if (this.data.fromPage == "root") {
      wx.navigateBack({
        delta: 1
      });
    }
  },
  viewComment: function () {
    console.log('view comments')
    if (this.data.commentCount === 0) {
      // console.log('nothing to view; return;')
      // return 
    }
    this.setData({
      commenting: true,
      commentText: null
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
    if (action === 'UP' && !this.data.viewAllOthers) {
      this.setData({
        viewAllOthers: true,
        othersOpenId: ''
      })
      this.onLoad()
    } else if ((action == 'LEFT' && this.data.reverse == "desc") || (action == 'RIGHT' && this.data.reverse == 'asc')) {
      console.log(this.data.fromPage)
      if (this.data.pageIndex - 1 >= 0){
        this.onLoadPage(this.data.pages[this.data.pageIndex - 1])
        this.setData({
          pageIndex: this.data.pageIndex - 1
        })
      } else if (this.data.fromPage == "root") {
        wx.navigateBack({
          delta: 1
        });
      }
    } else if ((action == 'RIGHT' && this.data.reverse == "desc") || (action == 'LEFT' && this.data.reverse == 'asc')) {
      this.setData({
        liked: false
      })
      if (this.data.pageIndex + 1 > this.data.pages.length - 5) {
        if (!this.data.viewAllOthers) {
          // only viewing some one's
          db.collection('pages').where({
            _openid: this.data.othersOpenId
          }).orderBy('publish_time', this.data.reverse)
            .skip(this.data.pages.length).get().then(res => {
            console.log(res)
            this.setData({ 
              pages: this.data.pages.concat(res.data)
            })
          })
        } else {
          // viewing all others

        }
      }
      
      if (this.data.pageIndex + 1 < this.data.pages.length) {
        // 看过 pageIndex 这一页了
        this.data.exclude.push(this.data.pages[this.data.pageIndex]._id)
        console.log(this.data.exclude)

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
      if (this.data.commentIndex + 1 < comment.length) {
        this.setData({
          commentIndex: this.data.commentIndex + 1,
          commentContent: this.data.comments[this.data.commentIndex + 1].comment_content
        })
      }
    } else if (action == 'RIGHT') {
      if (this.data.commentIndex - 1 > 0) {
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
  goViewOnes: function () {
    if (this.data.viewAllOthers) {
      let setDataRes = this.setData({
        othersOpenId: this.data.currentPage ? this.data.currentPage._openid : '',
        viewAllOthers: false
      })
      console.log(setDataRes)
      // this.onLoad()
      this.viewOnes()
    } else {
      console.log(' you are viewing ' + this.data.othersOpenId +  '\'s pages');
    }
  },
  goMyBook: function () {
    wx.navigateTo({
      url: './submitted'
    })
  },
  submitComment: function () {
    const _this = this
    if (this.data.commentText) {
      const db = wx.cloud.database()
      db.collection('comments').add({
        data: {
          comment_content: this.data.commentText,
          page_id: this.data.currentPage._id
        }
      }).then(res => {
        console.log(res);
        _this.setData({
          commenting: false
        })
        _this.onLoadPage(this.data.currentPage)
      })
    } else {
      console.log('only closing');
      this.setData({
        commenting: false
      })
    }
  },
  bindEquipmentId: function (e) {
    this.setData({
      commentText: e.detail.value
    })
  },
  submitLike: function() {
    wx.cloud.callFunction({
      name: 'likePage',
      data: {
        page_id: this.data.currentPage._id
      },
      success: res => {
        console.log(res) 
        this.setData({
          liked: true,
          likeCount: this.data.likeCount +1
        })
      }
    })
  }
})