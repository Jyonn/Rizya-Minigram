import {Form, FormPage} from './form'
import {inputSpaceName, inputSpaceTime, inputSpaceCover} from './form-pages/space-page'
import { inputMilestoneName, inputMilestoneTime } from './form-pages/milestone-page'
import { inputUserName } from './form-pages/space-user-page'
import { inputAlbumName, inputAlbumRowSize, inputAlbumCover } from './form-pages/album-page'

let getCreateSpaceForm = function() {
  return new Form({
    title: '星球加工厂',
    finishText: '加工',
    confirmExit: true,
    confirmExitText: '是否确认中止加工？',
  })
  .addPage(new FormPage().addInput(inputSpaceName))
  .addPage(new FormPage().addInput(inputSpaceTime))
  .addPage(new FormPage().addInput(inputSpaceCover))
}

let getCreateMilestoneForm = function() {
  return new Form({
    title: '造碑工厂',
    finishText: '加工',
    confirmExit: true,
    confirmExitText: '是否确认中止加工？',
  })
  .addPage(new FormPage().addInput(inputMilestoneName))
  .addPage(new FormPage().addInput(inputMilestoneTime))
  .addPage(new FormPage().addInput(inputSpaceCover))
}

let getModifySpaceNameForm = function() {
  return new Form({
    title: '星球加工厂',
    finishText: '修改',
    confirmExit: false,
  })
  .addPage(new FormPage().addInput(inputSpaceName))
}

let getModifyMemberNameForm = function() {
  return new Form({
    title: '修改我的昵称',
    finishText: '修改',
    confirmExit: false,
  })
  .addPage(new FormPage().addInput(inputUserName))
}

let getModifyMilestoneForm = function() {
  return new Form({
    title: '里程碑二次加工厂',
    finishText: '加工',
    confirmExit: true,
    confirmExitText: '是否确认中止加工？',
  })
  .addPage(new FormPage().addInput(inputMilestoneName))
  .addPage(new FormPage().addInput(inputMilestoneTime))
}

let getCreateAlbumForm = function() {
  return new Form({
    title: '相册加工厂',
    finishText: '加工',
    confirmExit: false,
  })
  .addPage(new FormPage().addInput(inputAlbumName).addInput(inputAlbumRowSize))
  .addPage(new FormPage().addInput(inputAlbumCover))
}

let getModifyAlbumForm = function() {
  return new Form({
    title: '相册加工厂',
    finishText: '加工',
    confirmExit: false,
  })
  .addPage(new FormPage().addInput(inputAlbumName).addInput(inputAlbumRowSize))
}

export {getCreateSpaceForm, getCreateMilestoneForm, getModifySpaceNameForm, getModifyMemberNameForm, getModifyMilestoneForm, getCreateAlbumForm, getModifyAlbumForm}
