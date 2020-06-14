// components/select-box/select-box.js

const ITEM_HEIGHT = 53
const CANCEL_HEIGHT = 6 + ITEM_HEIGHT
const HEADER_HEIGHT = ITEM_HEIGHT

Component({
  data: {
    isShowing: false,
    bottomPosition: -CANCEL_HEIGHT,
    choices: [],
    showCancel: Boolean,
    cancelText: '取消',
    totalHeight: -CANCEL_HEIGHT,
  },

  methods: {
    bindChoice: function(e) {
      const key = e.currentTarget.dataset.key
      this.triggerEvent('choice', key)
      this.stopShow()
    },
    bindCancel: function() {
      this.triggerEvent('cancel')
      this.stopShow()
    },
    setChoices({choices, showCancel=true, cancelText='取消', showHeader=false, headerText=''}) {
      const totalHeight = choices.length * ITEM_HEIGHT + (showCancel ? CANCEL_HEIGHT : 0) + (showHeader ? HEADER_HEIGHT : 0)
      this.setData({
        choices: choices,
        showCancel: showCancel,
        cancelText: cancelText,
        bottomPosition: -totalHeight,
        totalHeight: totalHeight,
        showHeader: showHeader,
        headerText: headerText,
      })
      return this
    },
    startShow() {
      this.setData({
        isShowing: true,
        bottomPosition: 0,
      })
    },
    stopShow() {
      this.setData({
        isShowing: false,
        bottomPosition: -this.data.totalHeight,
      })
    },
  },
})
