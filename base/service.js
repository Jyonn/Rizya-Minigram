import {Request} from './request'

class Service {

  // 用户相关API
  static code2session({code}) {
    return Request.get('/user/code', {code: code})
  }

  static updateUserInfo({encryptedData, iv}) {
    return Request.put('/user/', {
      encrypted_data: encryptedData,
      iv: iv,
    })
  }

  // 星球相关API
  static getSpaces() {
    return Request.get('/space/')
  }

  static createSpace({name, start_date}) {
    return Request.post('/space/', {
      name: name,
      start_date: start_date,
      access: 'PRV',
    })
  }

  static getSpace({space_id}) {
    return Request.get(`/space/@${space_id}`)
  }

  static getSpaceCoverToken({space_id}) {
    return Request.get(`/space/${space_id}/cover`)
  }

  static deleteSpace({space_id}) {
    return Request.delete(`/space/@${space_id}`)
  }

  // 上传图片API
  static uploadImage({key, token, file}) {
    return Request.uploadFile(file, key, token)
  }

  // 星球里程碑API
  static createMilestone({space_id, name, start_date}) {
    return Request.post('/milestone/', {
      space_id: space_id,
      name: name,
      start_date: start_date
    })
  }

  static deleteMilestone({mid}) {
    return Request.delete(`/milestone/@${mid}`)
  }

  static updateMilestone({mid, start_date, name}) {
    return Request.put(`/milestone/@${mid}`, {
      start_date: start_date,
      name: name
    })
  }

  static setDefaultMilestone({mid}) {
    return Request.post(`/milestone/@${mid}`)
  }

  static getMilestoneCoverToken({mid}) {
    return Request.get(`/milestone/@${mid}/cover`)
  }

  // 星球个人信息API
  static modifyMemberName({space_id, name}) {
    return Request.put(`/space/@${space_id}/member`, {
      name: name
    })
  }

  static getMemberAvatarToken({space_id}) {
    return Request.get(`/space/@${space_id}/member/avatar`)
  }

  static removeMember({space_id, user_id}) {
    return Request.delete(`/space/@${space_id}/member/@${user_id}`)
  }

  static getInviteTicket({space_id}) {
    return Request.get(`/space/@${space_id}/ticket`)
  }

  static getInviteTicketInfo({ticket}) {
    return Request.post(`/space/ticket`, {
      ticket: ticket
    })
  }

  static joinSpace({ticket}) {
    return Request.put(`/space/ticket`, {ticket: ticket})
  }

  // 相册相关API
  static getAlbumInfo({album_id}) {
    return Request.get(`/album/@${album_id}`)
  }
}

export {Service}