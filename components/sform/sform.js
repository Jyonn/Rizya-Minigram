// components/sform/sform.js
import {Form} from '../../base/form'

Component({
  properties: {
    form: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentInput: null,
    isStart: true,
    isFinal: false,
    currentIndex: null,
    currentValue: null,
    allowNext: false,
    tempOptions: null,
    isFilling: false,
    errorHint: null,
  },
  lifetimes: {
    ready: function() {
      this.switchTo(0)
    }
  },
  methods: {
    bindNextStep: function() {
      if (this.data.allowNext) {
        if (this.data.currentInput.checker) {
          const result = this.data.currentInput.checker(this.data.currentValue, this.data.currentInput.name)
          if (!result[0]) {
            this.setData({
              errorHint: result[1]
            })
            return
          }
        }
        this.data.currentInput.value = this.data.currentValue
        if (this.data.currentInput.callback && this.data.currentInput.callback.after) {
          this.data.currentInput.callback.after(this.data.currentInput, this.data.currentIndex, this.data.form)
        }

        if (this.data.isFinal) {
          this.bindSubmitForm()
        } else {
          this.switchTo(this.data.currentIndex + 1)
        }
      }
    },
    bindLastStep: function() {
      this.switchTo(this.data.currentIndex - 1)
    },
    bindExitForm: function() {
      if (this.properties.form.confirmExit) {
        wx.showModal({
          content: this.properties.form.confirmExitText,
          showCancel: true,
          success: (res) => {
            if (res.confirm) {
              this.bindCancelForm()
            }
          }
        })
      } else {
        this.bindCancelForm()
      }
    },
    bindSubmitForm: function() {
      const data = {}
      this.properties.form.inputs.forEach(input => {
        data[input.key] = input.value
      })
      this.triggerEvent('submit', data)
      this.stopFill()
    },
    bindCancelForm: function() {
      this.triggerEvent('cancel')
      this.stopFill()
    },
    stopFill: function() {
      this.setData({
        isFilling: false,
      })
    },
    startFill: function() {
      this.switchTo(0)
      this.setData({isFilling: true})
    },
    switchTo: function(index=0) {
      if (!this.data.form) {
        return
      }

      const input = this.data.form.inputs[index]
      if (input.type === 'image') {
        input.value = null
      }
      this.setData({
        currentIndex: index,
        isStart: index === 0,
        isFinal: this.data.form.inputs.length == index + 1,
        currentInput: input,
        tempOptions: null,
      })
      this.updateValue(input.value)
      if (input.callback && input.callback.before) {
        input.callback.before(index, input, this.data.form)
      }
    },
    updateValue(value) {
      this.setData({
        currentValue: value,
        allowNext: this.data.currentInput.allowSkip || value,
        errorHint: null,
      })
    },
    bindInputChange: function(e) {
      this.updateValue(e.detail.value)
    },
    bindPickerChange: function(e) {
      this.updateValue(e.detail.value)
    },
    bindImageChange: function() {
      wx.chooseImage({
        count: 1,
        sourceType: ['album'],
        sizeType: ['original'],
        complete: (res) => {
          if (!res.tempFilePaths) {
            return 
          }
          wx.showLoading({
            title: '正在处理图片',
            mask: true,
          })
          const filePath = res.tempFilePaths[0]
          wx.getFileSystemManager().readFile({
            filePath: filePath,
            encoding: 'base64',
            success: res => {
              const imageEncoded = 'data:image/png;base64,' + res.data;
              this.updateValue(filePath)
              this.setData({
                tempOptions: {
                  coverStyle: `background-image: url("${imageEncoded}"); background-position: center center !important`,
                }
              })
              wx.hideLoading()
            }
          })
        },
      })
    }
  },
  options: {
    addGlobalClass: true,
  },
})
