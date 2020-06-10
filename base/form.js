class Form {
  constructor({title, finishText='完成', confirmExit=true, confirmExitText="确认退出？"}) {
    this.title = title
    this.finishText = finishText
    this.confirmExit = confirmExit
    this.confirmExitText = confirmExitText
    this.inputs = []
  }

  static getInputOptions() {
    return {
      type: 'text',
      password: false,
      placeholder: '',
      disabled: false,
      maxlength: -1,
    }
  }

  static getImageOptions() {
    return {
      width: 120,
      height: 200,
    }
  }

  static updateOptions(type, options) {
    let defaultOptions = {}
    if (type === 'input') {
      defaultOptions = this.getInputOptions()
    } else if (type === 'image') {
      defaultOptions = this.getImageOptions()
    }
    if (options instanceof Object) {
      for (const k in options) {
        defaultOptions[k] = options[k]
      }
    }
    return defaultOptions
  }

  static updateCallback(callback) {
    let defaultCallback = {
      before: null,
      after: null,
    }
    if (callback instanceof Object) {
      for (const k in options) {
        defaultCallback[k] = options[k]
      }
    }

    return defaultCallback
  }

  addInput({key, name, placeholder, type='input', allowSkip=false, callback, value=null, options, hint, checker}) {
    this.inputs.push({
      key: key,
      name: name,
      placeholder: placeholder,
      type: type,
      allowSkip: allowSkip,
      callback: Form.updateCallback(callback),
      options: Form.updateOptions(type, options),
      value: value,
      hint: hint,
      checker: checker,
    })
    return this
  }
  
  updateInput(key, options) {
    for (let i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i].key === key) {
        for (const k in options) {
          this.inputs[i][k] = options[k]
        }
      }
    }
  }
}

export {Form}