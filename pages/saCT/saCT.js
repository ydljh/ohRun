// pages/saCT/saCT.js
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
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '加入战队', //导航栏 中间的标题
      showBackPre: 1, //显示返回上一页
      showBackHome: 0, //显示返回主页
    },
    height: app.globalData.height * 2 + 20,
    status: 'c'
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
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
        // openId:'o3VuM5YikzIzdADRbx81nuei1nno'
      })
      this.getAllTeam(1)
    } else {
      app.getOpenIdCallback = res => {
        this.setData({
          openId: res.openid
          // openId:'o3VuM5YikzIzdADRbx81nuei1nno'
        })
        this.getAllTeam(1)
      }
    }
  },
  // 所有战队
  getAllCompany() {
    let that = this
    tool({
      url: "/team/getCompanyList",
      data: {
        openId: ''
      }
    }).then(res => {
      let rr = res.data.data
      rr.forEach(v => {
        v.showDate = util.timeChange(v.creatTime, 2)
      })
      that.setData({
        allList: rr
      })
    })
  },
  // 所有团队
  getAllTeam(s) {
    let that = this
    let oo = {
      id: that.data.comId,
      openId: ''
    }
    if (s) {
      oo.openId = that.data.openId
    }
    tool({
      url: '/team/getCompanyTeams',
      data: oo
    }).then(res => {
      let rr = res.data.data
      rr = rr.filter(v => v.status == 1)
      if (s) {
        that.setData({
          myTeam: rr
        })
        that.getAllTeam()
      } else {
        let mt = that.data.myTeam
        rr.forEach((v) => {
          mt.forEach((vv) => {
            if (v.id == vv.id) {
              v.mystate = vv.status
            }
          })
        })
        that.setData({
          teamList: rr
        })
      }
    })
  },
  // 加入团队
  addTeam(e) {
    let that = this
    let v = e.currentTarget.dataset.v
    if (v.type == 1) {
      wx.showModal({
        title: '提示',
        content: '加入团队需审核，请等待团长批准',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            that.adt(v)
          }
        }
      })
    } else {
      that.adt(v)
    }
  },
  adt(v) {
    let oo = {
      id: v.id,
      openId: this.data.openId
    }
    if (oo.openId) {
      tool({
        url: '/team/putPersonToTeam',
        data: oo
      }).then(res=>{
        wx.redirectTo({
          url: '/pages/myCT/myCT?id='+this.data.comId+'&state=2',
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.nav_status()
    // options.status = 't'
    // options.comId = 3
    if (options.status == 'c') {
      this.setData({
        "nvabarData.title": '加入战队',
        status: options.status
      })
      this.getAllCompany()
    } else {
      this.setData({
        "nvabarData.title": '加入团队',
        status: options.status
      })
      this.setData({
        comId: options.comId
      })
      this.getOpenId()
    }
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