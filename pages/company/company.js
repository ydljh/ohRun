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
      blue:1,
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的企业', //导航栏 中间的标题
      showBackPre: 0, //显示返回上一页
      showBackHome: 0, //显示返回主页
    },
    height: app.globalData.height * 2 + 20,
    myCompany: {},
    currI: 1,
    companyId: '',
    auditNum: 0,
    curClass: ''
  },
  nav_status() {
    if (getCurrentPages().length == 1) {
      this.setData({
        'nvabarData.showCapsule': 0,
        'nvabarData.showBackPre': 0, //显示返回上一页
        'nvabarData.showBackHome': 0, //显示返回主页
      })
    } else {
      this.setData({
        'nvabarData.showCapsule': 1,
        'nvabarData.showBackPre': 1, //显示返回上一页
        'nvabarData.showBackHome': 0, //显示返回主页
      })
    }
  },
  toggleList(e) {
    this.setData({
      currI: e.currentTarget.dataset.i
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 获取滚动固定高度
  getHeight() {
    var that = this;
    wx.createSelectorQuery().select('#head').boundingClientRect(function (rect) {
      rect.height; // 节点高度
    }).exec(function (res) {
      that.setData({
        headerHeight: res[0].height - (res[0].top / 2)
      })
    })
  },
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
        // openId:'o3VuM5YikzIzdADRbx81nuei1nno'
      })
      this.getmyCompany()
      this.getTeam()
    } else {
      app.getOpenIdCallback = res => {
        this.setData({
          openId: res.openid
          // openId:'o3VuM5YikzIzdADRbx81nuei1nno'
        })
        this.getmyCompany()
        this.getTeam()
      }
    }
  },
  // 获取战队信息及与我的关系
  getmyCompany() {
    let that = this
    let oo = {
      openId: that.data.openId,
      id: that.data.companyId
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
        if (rr.type != 0 && rr.type != 1 && rr.type != 2) {
          that.getTeam(1)
        }
        if (rr.type == 3) {
          if (rr.stateCom == 2) {
            let jj = {
              id: that.data.companyId
            }
            tool({
              url: '/team/getCompanyApply',
              data: jj
            }).then(res => {
              let rr = res.data.data.length
              let an = that.data.auditNum
              an += rr
              that.setData({
                auditNum: an
              })
            })
          }
        }
      } else {
        if (app.globalData.share) {
          // 通过分享进入，直接添加 
          // 注 分享时把战队id加上
        } else {
          wx.redirectTo({
            url: '/pages/creatJoinc/creatJoinc',
          })
        }
      }
    })
  },
  // 获取战队成员
  getPresonList() {
    let that = this
    let oo = {
      id: that.data.companyId
    }
    tool({
      url: '/team/getCompanyPerson',
      data: oo
    }).then(res => {
      let rr = res.data.data
      that.setData({
        userList: rr
      })
    })
  },
  // 获取团队
  getTeam() {
    let that = this
    let td = that.data
    let oo = {
      id: td.companyId,
      openId: ''
    }
    tool({
      url: '/team/getCompanyTeams',
      data: oo
    }).then(res => {
      let rr = res.data.data
      let bb = rr.filter(v => v.status == 3)
      let an = that.data.auditNum
      an += bb.length
      that.setData({
        auditNum: an
      })
      rr = rr.filter(v => v.status == 1)
      that.setData({
        allTeam: rr
      })
    })
  },
  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.nav_status()
    // options.comId = 9
    this.setData({
      companyId: options.comId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getHeight()
    // wx.createSelectorQuery().select('.list_item').boundingClientRect(function (rect) {
    //   rect.height; // 节点高度
    // }).exec(function (res) {
    //   that.itemHeight = res[0].height;
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      auditNum: 0
    })
    this.getOpenId()
    this.getPresonList()
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
  // 页面滚动
  onPageScroll(e) {
    if (e.scrollTop >= this.data.headerHeight && !this.data.curClass) {
      // 当页面顶端距离大于一定高度时
      this.setData({
        curClass: 'item_fix'
      })
    } else if (e.scrollTop <= this.data.headerHeight && this.data.curClass) {
      this.setData({
        curClass: ''
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})