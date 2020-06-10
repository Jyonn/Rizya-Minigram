import {Service} from "./base/service"
import {Request} from "./base/request"
import {Subscriber} from "./base/subscriber"

//app.js
App({
  globalData: {
    userID: new Subscriber(),
    userInfo: new Subscriber(),
    navHeight: new Subscriber(),
  },

  onLaunch: function() {
    wx.login({
      success: res => {
        Service.code2session({code: res.code}).then(resp => {
          wx.getSetting({
            success: res => {
              if (!res.authSetting['scope.userInfo']) {
                this.setUserInfo(null)
              } else {
                wx.getUserInfo({success: this.setUserInfo})
              }
            }
          })
          Request.saveToken(resp.token)
          this.globalData.userID.subscribe(resp.user_id)
        })
      }
    })

    wx.getSystemInfo({
      success: res => {
        this.globalData.navHeight.subscribe(res.statusBarHeight);
      }
    })
    this.globalData.userInfo.observed_by(this.updateUserInfo)
  },
  setUserInfo: function(res) {
    let userInfo = null
    if (res) {
      userInfo = {
        info: res.userInfo,
        encryptedData: res.encryptedData,
        iv: res.iv
      }
    }
    this.globalData.userInfo.subscribe(userInfo)
  },
  updateUserInfo: function() {
    const userInfo = this.globalData.userInfo.value
    if (userInfo) {
      Service.updateUserInfo({
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv,
      }).then()
    }
  },
})