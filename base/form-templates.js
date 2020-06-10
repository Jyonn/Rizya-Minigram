import {Form} from './form'

class Result {
  constructor(allow=true, hint=null) {
    this.allow = allow
    this.hint = hint
  }
}

let lengthChecker = function({maxlength, minlength}) {
  return (value, name) => {
    if (maxlength && value.length > maxlength) {
      // return Result(false, `长度应小于${maxlength}个字符`)
      return [false, `${name}应小于${maxlength}个字符`]
    }
    if (minlength && value.length < minlength) {
      // return Result(false, `长度应大于${maxlength}个字符`)
      return [false, `${name}应大于${minlength}个字符`]
    }
    return [true]
  }
}

let getCreateSpaceForm = function({today}) {
  return new Form({
    title: '星球加工厂',
    finishText: '加工',
    confirmExit: true,
    confirmExitText: '是否确认中止加工？',
  }).addInput({
    key: 'name',
    name: '设置星球名称',
    placeholder: '在此填写…',
    type: 'input',
    options: {
      maxlength: 20,
    },
    checker: lengthChecker({maxlength: 20, minlength: 2})
  }).addInput({
    key: 'start_date',
    name: '设置星球诞生时间',
    type: 'picker',
    value: today,
    options: {
      mode: 'date',
      start: '1900-01-01',
      end: today
    }
  }).addInput({
    key: 'cover',
    name: '设置封面图片',
    hint: '图片预览方向可能存在颠倒或旋转，加工后将自动解决',
    type: 'image',
    placeholder: '点击更换封面',
  })
}

let getCreateMilestoneForm = function({today}) {
  return new Form({
    title: '造碑工厂',
    finishText: '加工',
    confirmExit: true,
    confirmExitText: '是否确认中止加工？',
  }).addInput({
    key: 'name',
    name: '设置里程碑名称',
    placeholder: '在此填写…',
    type: 'input',
    options: {
      maxlength: 20,
    },
    checker: lengthChecker({maxlength: 20, minlength: 2})
  }).addInput({
    key: 'start_date',
    name: '设置里程碑时间',
    type: 'picker',
    value: today,
    options: {
      mode: 'date',
      start: '1900-01-01',
      end: today
    }
  }).addInput({
    key: 'cover',
    name: '设置封面图片',
    hint: '图片预览方向可能存在颠倒或旋转，加工后将自动解决',
    type: 'image',
    placeholder: '点击更换封面',
  })
}

export {getCreateSpaceForm, getCreateMilestoneForm}
