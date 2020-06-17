import {getTodayDate, lengthChecker, timeReader, imageReader} from '../utils'


// ******************   Space星球创建类

let inputSpaceName = {
  key: 'name',
  name: '设置星球名称',
  placeholder: '在此填写…',
  type: 'input',
  options: {
    maxlength: 20,
  },
  checker: lengthChecker({maxlength: 20, minlength: 2, object: "星球名称"})
}

let inputSpaceTime = {
  key: 'start_date',
  name: '设置星球诞生时间',
  type: 'picker',
  value: getTodayDate,
  options: {
    mode: 'date',
    start: '1900-01-01',
    end: getTodayDate,
  },
  reader: timeReader,
}

let inputSpaceCover = {
  key: 'cover',
  name: '设置封面图片',
  hint: '图片预览方向可能存在颠倒或旋转，加工后将自动解决',
  type: 'image',
  placeholder: '点击更换封面',
  reader: imageReader,
}

// ******************   Space星球创建类


export {inputSpaceName, inputSpaceTime, inputSpaceCover}
