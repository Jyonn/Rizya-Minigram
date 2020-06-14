import { Service } from "../../base/service"

const app = getApp()

// pages/invite/invite.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: 20,
    userInfo: null,
    ticketSuccess: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    this.ticket = options.ticket

    wx.showLoading({
      title: '正在加载数据'
    })
    app.globalData.navHeight.observed_by(navHeight => {
      this.setData({navHeight: navHeight})  
    })

    app.globalData.userInfo.observed_by(userInfo => {
      this.setData({userInfo: userInfo})
    })

    app.globalData.userID.observed_by(this.analyseTicket)
  },

  analyseTicket: function() {
    Service.getInviteTicketInfo({ticket: this.ticket}).then(resp => {
      this.setData({
        space: resp.space,
        avatar: resp.avatar,
        name: resp.name,
        ticketSuccess: true,
      })
      wx.hideLoading()
    }).catch(err => {
      this.setData({
        ticketSuccess: false,
      })
      wx.hideLoading()
    })
  },

  bindBackIndex: function() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  bindJoinSpace: function() {
    Service.joinSpace({ticket: this.ticket}).then(resp => {
      wx.redirectTo({
        url: `/pages/space/space?spaceId=${this.data.space.space_id}`,
      })
    }).catch(error => {
      wx.redirectTo({
        url: `/pages/space/space?spaceId=${this.data.space.space_id}`,
      })
    })
  },

  getUserInfo: function(e) {
    if (e.detail.errMsg != "getUserInfo:ok") {
      return
    }
    app.setUserInfo(e.detail)
  },
})