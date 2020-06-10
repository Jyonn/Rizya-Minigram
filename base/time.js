class Time {
  static formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }

  static formatDate(datetime) {
    const year = datetime.getFullYear()
    const month = datetime.getMonth() + 1
    const day = datetime.getDate()
    return [year, month, day].map(this.formatNumber).join('-')
  }

  static formatTime(datetime) {
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [hour, minute, second].map(formatNumber).join(':')
  }

  formatDatetime(datetime) {
    return [this.formatDate(datetime), this.formatTime(datetime)].join(' ')
  }
}

export {Time}