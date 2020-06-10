import {Service} from '../../base/service'
import {getCreateMilestoneForm} from '../../base/form-templates'
import {Time} from "../../base/time"

const app = getApp()

Page({
  data: {
    navHeight: 20,
    spaceId: null,
    space: {
      name: null,
      milestones: [],
    },
    form: null,
    mode: null,
  },

  onLoad: function (options) {
    this.sform = this.selectComponent('#sform')

    this.setData({
      spaceId: options.spaceId,
    })
    app.globalData.navHeight.observed_by(navHeight => {
      this.setData({navHeight: navHeight})  
    })

    app.globalData.userID.observed_by(this.getSpace)
  },

  onReady: function () {

  },

  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
  onShareAppMessage: function () {

  },

  getSpace: function() {
    Service.getSpace({space_id: this.data.spaceId}).then(resp => {
      this.setData({space: resp})
    }).catch(error => {
      wx.navigateBack()
    })
  },

  bindFormSubmit(e) {
    if (this.data.mode === 'milestone') {
      return this.createMilestone(e)
    }
  },

  startCreateMilestoneForm: function() {
    this.setData({
      form: getCreateMilestoneForm({
        today: Time.formatDate(new Date()),
      }),
      mode: 'milestone',
    })
    this.sform.startFill()
  },

  createMilestone(e) {
    const data = e.detail
    wx.showLoading({
      title: '正在造碑',
    })
    Service.createMilestone({
      space_id: this.data.spaceId,
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
        this.getSpace()
      }).catch(() => {
        wx.hideLoading()
        this.getSpace()
      })
    }).catch(() => {
      wx.hideLoading()
    })
  }
})