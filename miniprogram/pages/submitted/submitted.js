// miniprogram/pages/submitted/submitted.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageId: '',
    pageContent: '',
    likeCount: 123,
    commentCount: 234,
    showComments: false
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
  }
})