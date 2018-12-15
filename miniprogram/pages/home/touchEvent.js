// miniprogram/pages/home/touchEvent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX: 0,
    startY: 0,
    action: '',
    activeIndex: 0,
    activeStatus: 'inactive',
    list: [{
      text: '1'
    }, {
      text: '2'
    }, {
      text: '3'
    }]
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
  touchmove: function() {
    // console.log('touchmove');
    // console.log(arguments);
  },
  touchstart: function(event) {
    console.log('touchstart');
    // console.log(arguments);
    this.setData({
      startX: event.touches[0].pageX,
      startY: event.touches[0].pageY
    })
  },
  touchend: function(event) {
    console.log('touchend');
    console.log(event);
    let endX = event.changedTouches[0].pageX;
    let endY = event.changedTouches[0].pageY;
    console.log(JSON.stringify(this.data));
    let action;
    if (endX < this.data.startX && Math.abs(endY - this.data.startY) < 10) {
      action = 'LEFT'
    } else if (endX > this.data.startX && Math.abs(endY - this.data.startY) < 10) {
      action = 'RIGHT'
    }
    this.setAction(action);
  },
  setAction (action) {
    let activeIndex = this.data.activeIndex

    if (action === 'LEFT') {
      activeIndex = ((activeIndex - 1) + 3)%3
    } else {
      activeIndex = ((activeIndex + 1))%3
    }
    this.setData({
      action: action,
      activeIndex: activeIndex
    })
  },
  tap () {
    this.setData({
      activeStatus: 'active'
    })
  }
})