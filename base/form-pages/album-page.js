import {lengthChecker, imageReader} from '../utils'

let inputAlbumName = {
  key: 'name',
  name: '设置相册名称',
  placeholder: '在此填写…',
  type: 'input',
  options: {
    maxlength: 15,
  },
  checker: lengthChecker({maxlength: 15, minlength: 2, object: '相册名称'})
}

let inputAlbumRowSize = {
  key: 'grid_rows',
  name: '设置网格行数',
  type: 'slider',
  hint: '相册以瀑布流布局呈现，网格行数越多，图片越小',
  value: 6,
  options: {
    max: 10,
    min: 4,
    showValue: true,
  },
}

let inputAlbumCover = {
  key: 'cover',
  name: '设置相册封面',
  hint: '图片预览方向可能存在颠倒或旋转，加工后将自动解决；图片展示时会根据实际尺寸进行长宽调整',
  type: 'image',
  placeholder: '点击更换封面',
  reader: imageReader,
}

export {inputAlbumName, inputAlbumRowSize, inputAlbumCover}