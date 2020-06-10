Component({
  properties: {
    image: Object
  },
  options: {
    addGlobalClass: true,
  },
  data: {
    backgroundImage: null,
    backgroundColor: null,
  },
  lifetimes: {
    ready: function() {
      this.setData({
        backgroundColor: '#' + this.properties.image.color.substr(2),
        backgroundImage: `url("${this.properties.image.source}")`,
      })
    },
  }
})
