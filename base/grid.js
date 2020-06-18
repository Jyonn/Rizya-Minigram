class Grid {
  constructor(w, h) {
    this.w = w
    this.h = h
    this.imageSet = new Set()
  }

  getRadio() {
    return (this.h / this.w).toFixed(2)
  }
}


export {Grid}
