import {Time} from './time'

let getTodayDate = () => {return Time.formatDate(new Date())}

let timeReader = (value) => {
  return value.replace('-', '年', 1).replace('-', '月') + '日'
}

let lengthChecker = function({maxlength, minlength, object}) {
  return (value) => {
    if (maxlength && value.length > maxlength) {
      // return Result(false, `长度应小于${maxlength}个字符`)
      return [false, `${object}应小于${maxlength}个字符`]
    }
    if (minlength && value.length < minlength) {
      // return Result(false, `长度应大于${maxlength}个字符`)
      return [false, `${object}应大于${minlength}个字符`]
    }
    return [true]
  }
}

let imageReader = (filePath) => {
  if (!filePath) {
    return ''
  }

  if (filePath.startsWith('https://res.6-79.cn')) {
    return `background-image: url("${filePath}"); background-position: center center !important`
  }

  let imageEncoded = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(filePath, "base64")
  return `background-image: url("${imageEncoded}"); background-position: center center !important`;
}

export {lengthChecker, getTodayDate, timeReader, imageReader}
