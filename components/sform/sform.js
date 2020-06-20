// components/sform/sform.js
import {Form} from '../../base/form'

Component({
  /**
   * 组件的初始数据
   */
  data: {
    currentPage: null,
    isFirstPage: true,
    isLastPage: false,
    allowNext: false,
    isFilling: false,
    form: null,
  },
  lifetimes: {
    ready: function() {}
  },
  methods: {
    bindNextStep: function() {
      if (this.data.allowNext) {
        let inputs = this.data.form.pages[this.data.currentIndex].inputs
        for (let i = 0; i < inputs.length; i++) {
          let input = inputs[i]
          if (input.checker) {
            const result = input.checker(input.value)
            if (!result[0]) {
              this.updateInput({
                key: input.key,
                options: {errorHint: result[1]}
              })
              return
            }
          }
        }
        
        if (this.data.isLastPage) {
          this.bindSubmitForm()
        } else {
          this.switchPage(this.data.currentIndex + 1)
        }
      }
    },
    bindLastStep: function() {
      this.switchPage(this.data.currentIndex - 1)
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
      this.triggerEvent('submit', this.data.form.getValueDict())
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
    startFill: function(form) {
      this.setData({form: form})
      this.switchPage(0)
      this.setData({isFilling: true})
    },
    switchPage: function(index=0) {
      const page = this.data.form.getJsonPage({index: index, firstLoad: true})
      this.setData({
        currentIndex: index,
        isFirstPage: index === 0,
        isLastPage: this.data.form.pages.length == index + 1,
        currentPage: page,
      })
      this.allowNextDetect()
    },

    allowNextDetect: function() {
      let allowNext = true
      for (let i = 0; i < this.data.currentPage.inputs.length; i++) {
        let input = this.data.currentPage.inputs[i]
        if (!input.allowSkip && !input.value)
          allowNext = false
      }
      this.setData({allowNext: allowNext})
    },

    updateInput({key, options}) {
      this.data.form.updateInput(key, options)
      const page = this.data.form.getJsonPage({index: this.data.currentIndex})
      this.setData({currentPage: page})
      this.allowNextDetect()
    },

    updateValue({key, value}) {
      this.updateInput({
        key: key,
        options: {value: value},
      })
    },
    bindInputChange: function(e) {
      this.updateValue({
        key: e.currentTarget.dataset.key,
        value: e.detail.value,
      })
    },
    bindPickerChange: function(e) {
      this.updateValue({
        key: e.currentTarget.dataset.key,
        value: e.detail.value,
      })
    },
    bindSliderChange: function(e) {
      this.updateValue({
        key: e.currentTarget.dataset.key,
        value: e.detail.value,
      })
    },
    bindImageChange: function(e) {
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
          this.updateValue({
            key: e.currentTarget.dataset.key,
            value: filePath,
          })
          wx.hideLoading()
        },
      })
    }
  },
  options: {
    addGlobalClass: true,
  },
})
