import {Service} from '../../base/service'
import {getCreateMilestoneForm, getModifySpaceNameForm, getModifyMemberNameForm, getModifyMilestoneForm, getCreateAlbumForm, getModifyAlbumForm} from '../../base/form-templates'
import { Album } from '../../base/album'
import {Subscriber} from "../../base/subscriber"

const app = getApp()

class FormID {
  static CreateMilestone = 'createMilestone'
  static ModifyMemberName = 'modifyMembername'
  static ModifyMilestone = 'modifyMilestone'
  static CreateAlbum = 'createAlbum'
  static ModifyAlbum = 'modifyAlbum'
}

// 主菜单
class MenuChoice {
  static StartEditMode = 'startEditMode'
  static InviteMember = 'inviteMember'
  static MoreOptions = 'moreOptions'
  static NavigateIndex = 'navigateIndex'
}

// 菜单表
class SboxMode {
  static RemoveMember = 'removeMember'
  static MoreOptions = 'moreOptions'
  static EditMilestone = 'editMilestone'
  static Album = 'album'
}

// 移除成员菜单
class RemoveMemberChoice {
  static RemoveMember = 'removeMember'
}

// 更多选项菜单
class MoreOptionsChoice {
  static DeleteSpace = 'deleteSpace'
  static LeaveSpace = 'leaveSpace'
}

// 编辑里程碑菜单
class EditMilestoneChoice {
  static ModifyInfo = 'modifyInfo'
  static ModifyCover = 'modifyCover'
  static SetDefault = 'setDefault'
  static Delete = 'delete'
}

// 相册菜单
class AlbumChoice {
  static NewSubAlbum = 'newSubAlbum'
  static UploadImage = 'uploadImage'
  static ManageAlbum = 'manageAlbum'
  static DeleteAlbum = 'deleteAlbum'
  static ModifyAlbum = 'modifyAlbum'
}

Page({
  data: {
    navHeight: 20,
    spaceId: null,
    space: {
      name: null,
      milestones: [],
      user: {
        avatar: null,
        name: null,
        is_owner: false,
      },
      album: null
    },
    form: null,
    formID: null,
    memberHeight: 40,
    memberShow: 1,
    isEditMode: false,
    sboxNormalMode: null,
    currentAlbum: {
      grid_rows: 6,
      items: [],
      album_id: null,
      albums: [],
      name: null,
      cover: null,
    },
    averageSize: 0,
    isManageImage: false,
    uploadImageInfo: {
      isUploading: false,
      totalCount: 0,
      uploadedCount: 0,
    }
  },

  onLoad: function (options) {    
    this.sbox = this.selectComponent('#sbox')
    this.sform = this.selectComponent('#sform')
    this.sboxNormal = this.selectComponent('#sboxNormal')
    this.albumSize = new Subscriber()

    setTimeout(() => {
      this.createSelectorQuery()
      .select('#album')
      .boundingClientRect(rect => {
        this.albumSize.subscribe(rect)
      }).exec()
    }, 1000)

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
    this.getSpace()
  },
  onShareAppMessage: function () {

  },

  getAlbumInfo: function(album_id) {
    Service.getAlbumInfo({album_id: album_id}).then(resp => {
      this.displayAlbum(resp)
    })
  },

  displayAlbum: function(albumData, reMatch=true) {
    let currentAlbum = albumData
    if (reMatch) {
      this.album = new Album(albumData.items, albumData.grid_rows)
    } else {
      this.album.updateGrids()
    }
    currentAlbum.items = this.album.items
    this.setData({
      currentAlbum: currentAlbum,
      albumMaxWidth: this.album.maxWidth,
    })
    this.albumSize.observed_by(rect => {
      let size = Math.floor(rect.height / this.data.currentAlbum.grid_rows)
      this.setData({averageSize: size})
    })
  },

  addAlbumItems(items) {
    let currentAlbum = this.data.currentAlbum
    this.album.matchGrids(items)
    this.album.items = this.album.items.concat(items)
    currentAlbum.items = this.album.items
    this.setData({
      currentAlbum: currentAlbum,
      albumMaxWidth: this.album.maxWidth,
    })
  },

  navigateToIndex: function() {
    wx.navigateTo({
      url: '/pages/index/index',
    });
  },

  // 中央API
  getSpace: function() {
    Service.getSpace({space_id: this.data.spaceId}).then(resp => {
      let memberShow = resp.members.length
      if (memberShow > 5) {
        memberShow = 5
      }
      for (let member of resp.members) {
        member.user_id = member.user.user_id
      }

      this.setData({
        space: resp,
        memberHeight: memberShow * 45 - 5,
        memberShow: memberShow,
      })
      this.getAlbumInfo(resp.album)
      this.refreshMenu()
    }).catch(error => {
      console.log(error)
      wx.navigateBack()
    })
  },

  // 菜单相关
  refreshMenu: function() {
    const choices = [{
      key: MenuChoice.StartEditMode,
      value: '编辑',
    }, {
      key: MenuChoice.InviteMember,
      value: '邀请',
      openType: 'share',
    }, {
      key: MenuChoice.MoreOptions,
      value: '更多设置',
    }]
    this.sbox.setChoices({
      choices: choices,
      showCancel: true,
      cancelText: '回到首页',
    })
  },

  // 显示菜单
  showMenu: function() {
    wx.vibrateShort()
    
    Service.getInviteTicket({
      space_id: this.data.spaceId
    }).then(resp => {
      this.setData({
        inviteTicket: resp
      })
      this.sbox.startShow()
    })
  },

  // 菜单点击选项
  bindChoiceMenu: function(e) {
    switch (e.detail) {
      case MenuChoice.MoreOptions:
        return this.startMoreOptionMenu()
      case MenuChoice.StartEditMode:
        return this.startEditMode();
      // case MenuChoice.NavigateIndex:
        // return this.navigateToIndex();
    }
  },

  // 进入或退出编辑模式
  startEditMode: function() {
    this.setData({
      isEditMode: true,
    })
  },

  exitEditMode: function(e) {
    this.setData({
      isEditMode: false,
    })
  },

  // 普通菜单点击选项
  bindSboxNormalChoice: function(e) {
    switch (this.data.sboxNormalMode) {
      case SboxMode.RemoveMember:
        return this.analyseRemoveMemberChoice(e)
      case SboxMode.MoreOptions:
        return this.analyseMoreOptionChoice(e)
      case SboxMode.EditMilestone:
        return this.analyseEditMilestoneChoice(e)
      case SboxMode.Album:
        return this.analyseAlbumChoice(e)
    }
  },

  bindFormSubmit(e) {
    switch (this.data.formID) {
      case FormID.CreateMilestone:
        return this.createMilestone(e)
      case FormID.ModifyMemberName:
        return this.modifyMemberName(e)
      case FormID.ModifyMilestone:
        return this.updateMilestone(e)
      case FormID.ModifyAlbum:
        return this.modifyAlbum(e)
      case FormID.CreateAlbum:
        return this.createAlbum(e)
    }
  },

  // 创建里程碑
  startCreateMilestoneForm: function() {
    this.setData({formID: FormID.CreateMilestone})
    this.sform.startFill(getCreateMilestoneForm())
  },

  createMilestone: function(e) {
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
  },

  deleteMilestone: function() {
    const milestone = this.data.currentEditMilestone
    wx.showModal({
      content: `确认敲碎「${milestone.name}」里程碑？`,
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          Service.deleteMilestone({
            mid: milestone.mid
          }).then(resp => {
            this.getSpace()
          })
        }
      }
    })
  },

  setDefaultMilestone: function() {
    const milestone = this.data.currentEditMilestone
    Service.setDefaultMilestone({
      mid: milestone.mid
    }).then(resp => {
      this.getSpace()
    })
  },

  updateMilestone: function(e) {
    let data = e.detail
    data.mid = this.data.currentEditMilestone.mid
    Service.updateMilestone(data).then(resp => {
      this.getSpace()
    })
  },

  modifyMilesoneCover: function(e) {
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      sizeType: ['original'],
      complete: (res) => {
        if (!res.tempFilePaths) {
          return 
        }
        wx.showLoading({title: '正在更新封面'})
        const filePath = res.tempFilePaths[0]
        Service.getMilestoneCoverToken({mid: this.data.currentEditMilestone.mid}). then(token => {
          Service.uploadImage({
            token: token[0],
            key: token[1],
            file: filePath,
          }).then(resp => {
            wx.hideLoading()
            this.getSpace()
          }).catch(error => {
            wx.hideLoading()
          })
        }).catch(error => {
          wx.hideLoading()
        })
      }
    })
  },

  // 修改空间名称
  startModifySpaceNameForm: function() {
    this.setData({
      form: getModifySpaceNameForm().updateValue('name', this.data.space.name),
      formID: FormID.ModifySpaceName,
    })
    this.sform.startFill()
  },

  // 修改星球居民昵称
  startModifyMemberNameForm: function() {
    this.setData({formID: FormID.ModifyMemberName})
    this.sform.startFill(
      getModifyMemberNameForm()
      .updateValue('name', this.data.space.user.name))
  },

  modifyMemberName: function(e) {
    Service.modifyMemberName({
      space_id: this.data.spaceId,
      name: e.detail.name,
    }).then(resp => {
      this.getSpace()
    })
  },

  // 修改居民头像
  modifyMemberAvatar: function() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      sizeType: ['original'],
      complete: (res) => {
        if (!res.tempFilePaths) {
          return 
        }
        wx.showLoading({title: '正在更新头像'})
        const filePath = res.tempFilePaths[0]
        Service.getMemberAvatarToken({space_id: this.data.spaceId}). then(token => {
          Service.uploadImage({
            token: token[0],
            key: token[1],
            file: filePath,
          }).then(resp => {
            wx.hideLoading()
            this.getSpace()
          }).catch(error => {
            wx.hideLoading()
          })
        }).catch(error => {
          wx.hideLoading()
        })
      }
    })
  },

  // 驱逐居民
  // 菜单
  startRemoveMemberMenu: function(e)  {
    if (!this.data.isEditMode) {
      return
    }
    if (!this.data.space.user.is_owner) {
      return
    }
    const member = e.currentTarget.dataset.member
    this.setData({
      currentRemoveMember: member.user.user_id,
      sboxNormalMode: SboxMode.RemoveMember
    })
    this.sboxNormal.setChoices({
      choices: [{
        key: RemoveMemberChoice.RemoveMember,
        value: '驱逐居民',
        style: 'warn',
      }],
      showHeader: true,
      headerText: `将居民“${member.name}”驱逐出星球，此操作不可撤销`,
      showCancel: true,
    }).startShow()
  },
  // 点击分析
  analyseRemoveMemberChoice: function(e) {
    if (e.detail == RemoveMemberChoice.RemoveMember) {
      Service.removeMember({
        space_id: this.data.spaceId,
        user_id: this.data.currentRemoveMember,
      }).then(resp => {
        this.getSpace()
      })
    }
  },

  // 更多设置
  // 菜单
  startMoreOptionMenu: function() {
    this.setData({
      sboxNormalMode: SboxMode.MoreOptions,
    })

    let choices;
    if (this.data.space.user.is_owner) {
      choices = {
        key: MoreOptionsChoice.DeleteSpace,
        value: '毁灭星球',
        style: 'warn',
      }
    } else {
      choices = {
        key: MoreOptionsChoice.LeaveSpace,
        value: '离开星球',
        style: 'warn',
      }
    }
    this.sboxNormal.setChoices({
      choices: [choices],
      showCancel: true,
    }).startShow()
  },
  analyseMoreOptionChoice: function(e) {
    switch (e.detail) {
      case MoreOptionsChoice.DeleteSpace:
      case MoreOptionsChoice.LeaveSpace:
        let verb = this.data.space.user.is_owner ? '毁灭' : '离开';
        return wx.showModal({
          content: `确认${verb}「${this.data.space.name}」的星球？`,
          showCancel: true,
          success: (res) => {
            if (res.confirm) {
              Service.deleteSpace({
                space_id: this.data.spaceId
              }).then(resp => {
                wx.navigateBack()
              })
            }
          }
        })
      
    }
  },

  // 相册
  // 菜单
  startAlbumMenu: function() {
    this.setData({
      sboxNormalMode: SboxMode.Album,
    })

    this.sboxNormal.setChoices({
      showHeader: true,
      headerText: '长按图片可进入删除模式',
      choices: [{
        key: AlbumChoice.NewSubAlbum,
        value: '创建相册',
      }, {
        key: AlbumChoice.UploadImage,
        value: '上传照片',
      }, {
        key: AlbumChoice.ModifyAlbum,
        value: '编辑相册信息',
      }],
      showCancel: true,
    }).startShow()
  },

  analyseAlbumChoice: function(e) {
    switch (e.detail) {
      case AlbumChoice.NewSubAlbum:
        return this.startCreateAlbumForm()
      case AlbumChoice.ModifyAlbum:
        return this.startModifyAlbumForm()
      case AlbumChoice.UploadImage:
        return this.uploadAlbumImage()
    }
  },

  startCreateAlbumForm: function() {
    this.setData({formID: FormID.CreateAlbum})
    this.sform.startFill(getCreateAlbumForm())
  },

  startModifyAlbumForm: function() {
    const album = this.data.currentAlbum
    this.setData({formID: FormID.ModifyAlbum})
    this.sform.startFill(
      getModifyAlbumForm()
      .updateValue('name', album.name)
      .updateValue('grid_rows', album.grid_rows)
    )
  },

  // 里程碑
  reStyleAlbum: function() {
    wx.vibrateShort()
    this.displayAlbum(this.data.currentAlbum)
  },

  startEditMilestoneMenu: function(e) {
    const milestone = e.currentTarget.dataset.milestone
    const isDefault = milestone.mid === this.data.space.default_milestone

    this.setData({
      currentEditMilestone: milestone,
      sboxNormalMode: SboxMode.EditMilestone,
    })

    let choices = [{
      key: EditMilestoneChoice.ModifyInfo,
      value: '修改信息'
    }, {
      key: EditMilestoneChoice.ModifyCover,
      value: '更换封面',
    }]
    if (!isDefault) {
      choices = choices.concat([{
        key: EditMilestoneChoice.SetDefault,
        value: '设为星球默认里程碑'
      }, {
        key: EditMilestoneChoice.Delete,
        value: '敲碎里程碑',
        style: 'warn'
      }])
    }
    this.sboxNormal.setChoices({
      choices: choices,
      showHeader: isDefault,
      headerText: `「${milestone.name}」是星球默认里程碑，无法敲碎`,
      showCancel: true,
    }).startShow()
  },

  analyseEditMilestoneChoice: function(e) {
    switch (e.detail) {
      case EditMilestoneChoice.Delete:
        return this.deleteMilestone()
      case EditMilestoneChoice.SetDefault:
        return this.setDefaultMilestone()
      case EditMilestoneChoice.ModifyInfo:
        return this.startModifyMilestoneInfoForm()
      case EditMilestoneChoice.ModifyCover:
        return this.modifyMilesoneCover()
    }
  },

  startModifyMilestoneInfoForm: function() {
    const milestone = this.data.currentEditMilestone
    this.setData({formID: FormID.ModifyMilestone})
    this.sform.startFill(
      getModifyMilestoneForm()
      .updateValue('name', milestone.name)
      .updateValue('start_date', milestone.start_date))
  },

  createAlbum: function(e) {
    let data = e.detail
    data.album_id = this.data.currentAlbum.res_id
    wx.showLoading({title: '正在加工相册'})
    Service.createAlbum(data).then(token => {
      Service.uploadImage({
        token: token[0],
        key: token[1],
        file: data.cover,
      }).then(resp => {
        this.addAlbumItems([resp])
        wx.hideLoading()
      }).catch(err => {
        wx.hideLoading()
      })
    })
  },

  modifyAlbum: function(e) {
    let data = e.detail
    data.album_id = this.data.currentAlbum.res_id
    Service.updateAlbumInfo(data).then(resp => {
      let currentAlbum = this.data.currentAlbum
      currentAlbum.name = data.name
      if (currentAlbum.grid_rows !== data.grid_rows) {
        currentAlbum.grid_rows = data.grid_rows
        this.displayAlbum(currentAlbum)
      } else {
        this.setData({
          currentAlbum: currentAlbum
        })
      }
    })
  },

  // 邀请
  onShareAppMessage(e) {
    if (e.from == 'button') {
      const data =  {
        title: `${this.data.space.user.name}邀请您加入「${this.data.space.name}」的星球`,
        path: `/pages/invite/invite?ticket=${this.data.inviteTicket}`,
        imageUrl: this.data.space.cover.source,
      }
      return data
    }
  },

  previewImage: function(e) {
    if (this.data.isManageImage)
      return

    let item = this.data.currentAlbum.items[e.currentTarget.dataset.index]
    if (item.type === 'image') {
      wx.previewImage({
        urls: [item.source.origin],
      })
    } else {
      this.getAlbumInfo(item.res_id)
    }
  },

  backParentAlbum: function() {
    this.getAlbumInfo(this.data.currentAlbum.parent)
  },

  startManageImage: function() {
    this.setData({isManageImage: true})
  },

  doneManageImage: function() {
    wx.vibrateShort()
    this.setData({isManageImage: false})
  },

  deleteImage: function(e) {
    let data = e.currentTarget.dataset
    let currentAlbum = this.data.currentAlbum
    let item = currentAlbum.items[data.index]
    
    let deleteString = item.type === 'image' ? '图片' : `「${item.name}」相册`
    deleteString = `确认删除${deleteString}？`

    wx.showModal({
      content: deleteString,
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          let req
          if (item.type === 'image')
            req = Service.deleteAlbumImage({image_id: item.res_id})
          else
            req = Service.deleteAlbum({album_id: item.res_id})
          req.then(resp => {
            currentAlbum.items.splice(data.index, 1)
            this.displayAlbum(currentAlbum, false)
          }).catch(err => {})
        }
      }
    })
  },

  uploadAlbumImage: function() {
    wx.chooseImage({
      count: 99,
      sourceType: ['album'],
      sizeType: ['original'],
      complete: (res) => {
        if (!res.tempFilePaths) {
          return 
        }
        
        this.setData({
          uploadImageInfo: {
            isUploading: true,
            totalCount: res.tempFilePaths.length,
            uploadedCount: 0
          }
        })

        Service.getAlbumImageToken({
          album_id: this.data.currentAlbum.res_id,
          image_num: res.tempFilePaths.length
        }). then(tokens => {
          this.uploadAlbumImageWorker(tokens, res.tempFilePaths).then(images => {
            this.addAlbumItems(images)
          })
          
        }).catch(error => {
          
        })
      }
    })
  },

  uploadAlbumImageWorker: async function(tokens, filePaths) {
    let images = []
    let uploadImageInfo = this.data.uploadImageInfo

    for (let index = 0; index < tokens.length; index++) {
      uploadImageInfo.uploadedCount = index + 1
      this.setData({uploadImageInfo: uploadImageInfo})

      let token = tokens[index]
      images.push(await Service.uploadImage({
        token: token[0],
        key: token[1],
        file: filePaths[index],
      }))
    }
    uploadImageInfo.isUploading = false
    this.setData({uploadImageInfo: uploadImageInfo})
    return images
  }
})