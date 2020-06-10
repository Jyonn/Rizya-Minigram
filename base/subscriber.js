class Subscriber {
  constructor() {
    this.observers = new Set()
    this.value = null
    this.subscribed = false
  }

  subscribe(value = null) {
    this.value = value
    this.subscribed = true
    this.observers.forEach(observer => observer(this.value))
  }

  observed_by(observer) {
    if (this.subscribed) {
      observer(this.value)
    }
    this.observers.add(observer)
  }
}

export {Subscriber}
