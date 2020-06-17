//index.js

import { Service } from "../../base/service"
import { getCreateSpaceForm } from '../../base/form-templates'
import {Time} from "../../base/time"

//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null,
    spaces: [],
    navHeight: 20,
    createSpaceForm: null,
  },
  onLoad: function () {
    this.sform = this.selectComponent('#sform')

    wx.showLoading({
      title: '正在加载数据'
    })
    app.globalData.navHeight.observed_by(navHeight => {
      this.setData({navHeight: navHeight})  
    })

    app.globalData.userInfo.observed_by(userInfo => {
      this.setData({userInfo: userInfo})
      wx.hideLoading()
    })

    app.globalData.userID.observed_by(this.getSpaces)
  },

  onPullDownRefresh() {
    this.getSpaces()
  },

  getSpaces() {
    Service.getSpaces().then(resp => this.setData({spaces: resp}))
  },

  getUserInfo: function(e) {
    if (e.detail.errMsg != "getUserInfo:ok") {
      return
    }
    app.setUserInfo(e.detail)
  },

  startCreateSpaceForm: function() {
    this.sform.startFill(getCreateSpaceForm())
  },

  navigateSpace: function(e) {
    // app.globalData.currentSpace = e.currentTarget.dataset.spaceId
    // wx.switchTab({
    //   url: `/pages/space/space`,
    // })
    wx.navigateTo({
      url: `/pages/space/space?spaceId=${e.currentTarget.dataset.spaceId}`,
    })
  },

  createSpace: function(e) {
    const data = e.detail
    wx.showLoading({
      title: '正在加工星球',
    })
    Service.createSpace({
      name: data.name,
      start_date: data.start_date,
    }).then(resp => {
      const token = resp.cover_token
      Service.uploadImage({
        token: token[0],
        key: token[1],
        file: data.cover,
      }).then(resp => {
        wx.hideLoading()
        this.getSpaces()
      }).catch(() => {
        wx.hideLoading()
        this.getSpaces()
      })
    })
  }
})
