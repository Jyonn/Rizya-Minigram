import { Grid } from "./grid";

class Album {
  constructor(items, rows) {
    this.items = items
    this.rows = rows
    this.UNSET = undefined

    this.initGrids()
    this.matchGrids()
    this.arrange()
  }

  initGrids() {
    this.matrix = []
    for (let i = 0; i < this.rows; i++)
      this.matrix.push([])

    this.grids = [
      new Grid(1, 1), new Grid(1, 2), new Grid(1, 3),
      new Grid(2, 1), new Grid(2, 2), new Grid(2, 3), new Grid(2, 4),
      new Grid(3, 1), new Grid(3, 2), new Grid(3, 3),
                      new Grid(4, 2)
    ]
    this.ratios = {}
    this.ratiosKey = []
    for (let i = 0; i < this.grids.length; i++) {
      let ratio = this.grids[i].getRadio()
      if (ratio in this.ratios)
        this.ratios[ratio].push(i)
      else {
        this.ratios[ratio] = [i]
        this.ratiosKey.push(ratio)
      }
    }

    this.ratiosKey.sort()
  }

  matchGrids() {
    for (let image of this.items) {
      image.grids = []

      let ratio = (image.height / image.width).toFixed(2)
      let i = 0
      for (; i < this.ratiosKey.length; i++) 
        if (this.ratiosKey[i] > ratio)
          break

      let matchRatios
      if (i === 0) matchRatios = [i]
      else if (i === this.ratiosKey.length) matchRatios = [i - 1]
      else matchRatios = [i - 1, i]

      for (let matchRatio of matchRatios) {
        let matchGrids = this.ratios[this.ratiosKey[matchRatio]]
        for (let grid of matchGrids) {
          grid = this.grids[grid]
          grid.imageSet.add(image)
          image.grids.push(grid)
        }
      }
    }
  }

  getRemainGrids() {
    let remainGrids = []
    for (let grid of this.grids) {
      if (grid.imageSet.size)
        remainGrids.push(grid)
    }
    return remainGrids
  }

  arrange() {
    let width = new Array(this.rows).fill(0)
    
    while (true) {
      let remainGrids = this.getRemainGrids()
      if (!remainGrids.length)
        break

      let minWidth = 0
      let height = 1
      let continuous = true
      for (let i = 1; i < this.rows; i++) {
        if (width[i] < width[minWidth]) {
          minWidth = i
          height = 1
          continuous = true
        } else if (width[i] == width[minWidth] && continuous) {
          height += 1
        } else {
          continuous = false
        }
      }

      let supportGrids = []
      for (let grid of remainGrids) {
        if (grid.h <= height)
          supportGrids.push(grid)
      }

      let selectedGridIndex = Math.floor(Math.random() * supportGrids.length)
      let selectedGrid = supportGrids[selectedGridIndex]
      let selectedImage = selectedGrid.imageSet.keys().next().value

      selectedImage.rect = {w: selectedGrid.w, h: selectedGrid.h}
      selectedImage.position = {x: width[minWidth], y: minWidth}

      for (let i = minWidth; i < minWidth + selectedGrid.h; i++) {
        width[i] += selectedGrid.w
      }

      for (let grid of selectedImage.grids) {
        grid.imageSet.delete(selectedImage)
      }
      delete selectedImage["grids"]
    }

    this.maxWidth = 0
    for (let w of width) {
      if (w > this.maxWidth)
        this.maxWidth = w
    }
  }
}

export {Album}
