// pages/cCompany/cCompany.js
const app = getApp()
const util = require('../../utils/util.js')
const userFun = require('../../utils/user')
const tool = util.tool
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '创建战队', //导航栏 中间的标题
      showBackPre: 1, //显示返回上一页
      showBackHome: 0, //显示返回主页
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    logo: '/image/add.png', //战队logo
    name: '', //公司/战队名称
    originator: '', //姓名
    phoneNumber: '', //手机号
    openId: '',
    userInfo: {},
    hasInfo: true,
    showGPhone: true
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
      })
      this.getUser()
      this.getmyCompany()
    } else {
      app.getOpenIdCallback = res => {
        this.setData({
          openId: res.openid
        })
        this.getUser()
        this.getmyCompany()
      }
    }
  },
  // 获取用户信息
  getUser() {
    let that = this
    let oo = {
      openId: this.data.openId
    }
    userFun.getUser(oo).then(r => {
      if (r && r.nikeName) {
        that.setData({
          originator: r.nikeName,
          hasInfo: false
        })
      }
      if (r && r.phone) {
        that.setData({
          phoneNumber: r.phone,
          showGPhone: false
        })
      }
    })
  },
  // logo
  toggleImg() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // // 上传图片
        wx.uploadFile({
          url: util.imgUrl + "/team/uploadImg",
          filePath: tempFilePaths[0],
          name: 'img',
          success(res) {
            // console.log(res)
            let imgName = JSON.parse(res.data).data.img
            that.setData({
              logo: imgName
            })
          }
        })
      }
    })
  },
  ipt1(e) {
    this.setData({
      name: e.detail.value
    })
  },
  ipt2(e) {
    this.setData({
      originator: e.detail.value
    })
  },
  ipt3(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  ipt4(e){
    this.setData({
      info: e.detail.value
    })
  },
  getUserInfo(e) {
    let that = this
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        originator: e.detail.userInfo.nickName,
        userInfo: e.detail.userInfo
      })
    }
  },
  // 获取手机号
  getPhone(e) {
    let that = this
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: res => {
          let JSCODE = res.code
          tool({
            url: "/team/getOpenId",
            data: {
              code: JSCODE
            },
          }).then(res => {
            let rv = res.data.data
            let obj = {
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData,
              sessionKey: rv.session_key
            }
            tool({
              url: "/team/getPhone",
              data: obj,
            }).then(val => {
              let vv = val.data.data
              if (vv) {
                that.setData({
                  phoneNumber: vv.purePhoneNumber,
                  showGPhone: false
                })
              }
            })
          })
        }
      })
    }
  },
  // 提交
  sub() {
    let that = this
    let td = that.data
    let obj = {
      logo: td.logo, //战队logo
      name: td.name, //公司/战队名称
      originator: td.originator, //姓名
      phoneNumber: td.phoneNumber, //手机号
      openId: td.openId,
      creatTime: new Date().getTime()
    }
    // console.log(obj)
    var sj = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/; //手机号包括港澳台
    let allMsg = true
    for (let k in obj) {
      if (!obj[k]) {
        if (k == 'name') {
          that.tost('请填写公司/组织名称')
        } else if (k == 'originator') {
          that.tost('请填写姓名')
        } else if (k == 'phoneNumber') {
          that.tost('请填写手机号')
        }
        allMsg = false
        break
      } else if (k == 'logo' && obj[k] == '/image/add.png') {
        that.tost('请选择logo')
        allMsg = false
        break
      } else if (k == 'phoneNumber' && !sj.test(obj[k])) {
        that.tost('请填写有效手机号')
        allMsg = false
        break
      }
    }
    obj.info=td.info //简介
    if (allMsg) {
      let oo = {
        openId: td.openId
      }
      userFun.getUser(oo).then(r => {
        if (r) {
          // 修改
          r.phone = td.phoneNumber
          r.name = td.originator
          if (JSON.stringify(td.userInfo) != '{}') {
            r.nikeName = td.userInfo.nickName
            r.sex = td.userInfo.gender
            r.city = td.userInfo.city
            r.headImgUrl = td.userInfo.avatarUrl
          }
          userFun.putUser(r)
        } else {
          // 添加
          let mm = {
            openId: td.openId,
            nikeName: '',
            sex: '',
            city: '',
            phone: td.phoneNumber,
            name: td.originator,
            headImgUrl: ''
          }
          if (JSON.stringify(td.userInfo) != '{}') {
            mm.nikeName = td.userInfo.nickName
            mm.sex = td.userInfo.gender
            mm.city = td.userInfo.city
            mm.headImgUrl = td.userInfo.avatarUrl
          }
          userFun.addUser(mm)
        }
      })
      tool({
        url: '/team/addCompany',
        data: obj,
        method: 'POST'
      }).then(res => {
        // wx.navigateTo({
        //   url: '/pages/myCT/myCT?id=' + res.data.data,
        // })
        wx.switchTab({
          url: '/pages/team/team',
        })
      })
    }
  },
  tost(v) {
    wx.showToast({
      title: v,
      icon: 'none',
      duration: 2000
    })
  },
  // 查询是否加入过战队
  getmyCompany() {
    let that = this
    let oo = {
      openId: that.data.openId
    }
    tool({
      url: '/team/getCompanyList',
      data: oo
    }).then(res => {
      let rr = res.data.data
      if (rr.length > 0) {
        if (rr[0].type == 0) {
          wx.showToast({
            title: '您已被拒绝加入战队,请创建或重新申请加入',
            icon: 'none',
            duration: 3000
          })
        } else {
          // wx.redirectTo({
          //   url: `/pages/myCT/myCT?id=${rr[0].id}`
          // })
          wx.switchTab({
            url: '/pages/team/team',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.nav_status()
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