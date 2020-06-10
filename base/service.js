import {Request} from './request'

class Service {
  static code2session({code}) {
    return Request.get('/user/code', {code: code})
  }

  static updateUserInfo({encryptedData, iv}) {
    return Request.put('/user/', {
      encrypted_data: encryptedData,
      iv: iv,
    })
  }

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

  static uploadImage({key, token, file}) {
    return Request.uploadFile(file, key, token)
  }

  static createMilestone({space_id, name, start_date}) {
    return Request.post('/milestone/', {
      space_id: space_id,
      name: name,
      start_date: start_date
    })
  }
}

export {Service}