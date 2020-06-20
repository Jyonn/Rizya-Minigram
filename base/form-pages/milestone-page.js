import {getTodayDate, lengthChecker} from '../utils'

let inputMilestoneName = {
  key: 'name',
  name: '设置里程碑名称',
  placeholder: '在此填写…',
  type: 'input',
  options: {
    maxlength: 20,
  },
  checker: lengthChecker({maxlength: 20, minlength: 2, object: '里程碑名称'})
}

let inputMilestoneTime = {
  key: 'start_date',
  name: '设置里程碑时间',
  type: 'picker',
  value: getTodayDate,
  options: {
    mode: 'date',
    start: '1900-01-01',
    end: getTodayDate
  }
}


export {inputMilestoneName, inputMilestoneTime}
