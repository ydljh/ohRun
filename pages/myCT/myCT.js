// pages/myCT/myCT.js
const app = getApp()
const util = require('../../utils/util.js')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的企业', //导航栏 中间的标题
      showBackPre: 0, //显示返回上一页
      showBackHome: 0, //显示返回主页
    },
    height: app.globalData.height * 2 + 20,
    myCompany: {},
    currI: 1,
    toggleCT:1
  },
  toggleList(e) {
    this.setData({
      currI: e.currentTarget.dataset.i
    })
  },
  toggleBtn(e){
    this.setData({
      toggleCT: e.currentTarget.dataset.i
    })
  },
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
      this.getmyCompany()
    } else {
      app.getOpenIdCallback = res => {
        this.setData({
          openId: res.openid
        })
        this.getmyCompany()
      }
    }
  },
  getmyCompany() {
    let that = this
    let oo = {
      openId: that.data.openId,
      id:that.data.companyId
    }
    tool({
      url: '/team/getCompanyBrief',
      data: oo
    }).then(res => {
      let rr = res.data.data
      if (rr) {
        rr.showDate = util.timeChange(rr.creatTime, 2)
        that.setData({
          myCompany: rr,
        })
      } else {
        if (app.globalData.share) {
          // 通过分享进入，直接添加 
          // 注 分享时把战队id加上
        } else [
          wx.redirectTo({
            url: '/pages/creatJoinc/creatJoinc',
          })
        ]
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      companyId: options.id
    })
    this.getOpenId()
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

  }
})