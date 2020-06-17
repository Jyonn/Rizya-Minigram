class Method {
  static GET = 'get'
  static POST = 'post'
  static PUT = 'put'
  static DELETE = 'delete'
}

class ErrorHandler {
  static handler(error) {
    if (error.hasOwnProperty('msg')) {
      console.log(error)
      error = error.msg
      Request.app.showInfo(error, 'error')
    }
    return Promise.reject(error)
  }

  static ignore(error) {}
}

class Request {
  static token = null
  static app = null
  
  static saveToken(token) {
    this.token = token
  }

  static saveApp(app) {
    this.app = app
  }

  static getQueryString(params) {
    const esc = encodeURIComponent
    return Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&')
  }

  static async uploadFile(file_path, key, token) {
    const req = new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'https://up.qiniup.com/',
        header: {
          'accept': 'application/json'
        },
        filePath: file_path,
        name: 'file',
        formData: {
          key: key,
          token: token
        },
        success: resolve,
        fail: reject,
      })
    })
    return req.then((resp) => {
      resp = resp.data
      try {
        resp = JSON.parse(resp)
      } catch {}
      if (!resp.hasOwnProperty('code')) {
        return ErrorHandler.handler(resp)
      }
      if (resp.code !== 0) {
        return ErrorHandler.handler(resp)
      }
      return resp.body
    }).catch(ErrorHandler.handler)
  }

  static async baseFetch(method, url, data=null) {
    if (url[0] == '/') {
      url = 'https://rizya-api.6-79.cn/v1' + url
    }
    if ((method === Method.GET || method === Method.DELETE) && data) {
        url += '?' + this.getQueryString(data)
        data = null
    }
    let req = new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: method,
        data: data || '',
        header: {
          'Content-type': "application/json",
          'Token': this.token || '',
        },
        success: resolve,
        fail: reject
      })
    })
    return req.then((resp) => {
      resp = resp.data
      if (!resp.hasOwnProperty('code')) {
        return ErrorHandler.handler(resp)
      }
      if (resp.code !== 0) {
        return ErrorHandler.handler(resp)
      }
      return resp.body
    }).catch(ErrorHandler.handler)
  }
  static async get(url, data=null) {
    return this.baseFetch(Method.GET, url, data)
  }
  static async post(url, data=null) {
    return this.baseFetch(Method.POST, url, data)
  }
  static async put(url, data=null) {
    return this.baseFetch(Method.PUT, url, data)
  }
  static async delete(url, data=null) {
    return this.baseFetch(Method.DELETE, url, data)
  }
}

export {Request, ErrorHandler}