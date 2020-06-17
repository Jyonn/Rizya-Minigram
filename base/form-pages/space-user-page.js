import {lengthChecker} from '../utils'

let inputUserName = {
  key: 'name',
  type: 'input',
  placeholder: '在此填写昵称…',
  options: {
    maxlength: 20,
  },
  checker: lengthChecker({maxlength: 20, minlength: 0})
}

export {inputUserName}
