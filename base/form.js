class Form {
  constructor({title, finishText='完成', confirmExit=true, confirmExitText="确认退出？"}) {
    this.title = title
    this.finishText = finishText
    this.confirmExit = confirmExit
    this.confirmExitText = confirmExitText
    this.pages = []
    this.inputs = {}
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

  addPage(page) {
    this.pages.push(page)
    for (let i = 0; i < page.inputs.length; i++) {
      this.inputs[page.inputs[i].key] = [this.pages.length - 1, i]
    }
    return this
  }

  getValueDict() {
    let dict = {}
    for (let key in this.inputs) {
      let input = this.pages[this.inputs[key][0]].inputs[this.inputs[key][1]];
      dict[key] = input.value
    }
    return dict
  }

  updateInput(key, options) {
    if (key in this.inputs) {
      let position = this.inputs[key]
      let input = this.pages[position[0]].inputs[position[1]]
      for (const k in options) {
        input[k] = options[k]
        if (k === 'value') {
          input.readableText = input.reader(input.value)
          input.errorHint = ''
        }
      }
    }
    return this
  }

  updateValue(key, value) {
    return this.updateInput(key, {value: value})
  }

  reset() {
    for (let i = 0; i < this.pages.length; i++)
      this.pages[i].reset()
  }

  getJsonPage({index, firstLoad=false}) {
    let page = this.pages[index]
    if (firstLoad) {
      page.onload()
    }
    return JSON.parse(JSON.stringify(page))
  }
}

class FormPage {
  constructor() {
    this.inputs = []
  }

  addInput({key, name, placeholder, type='input', allowSkip=false, value=null, options, hint, checker, reader, candidates}) {
    let attributes = arguments[0]
    for (let attribute in attributes) {
      if (typeof attributes[attribute] === "function") {
        if (!["checker", "reader", "options"].includes(attribute))
          attributes[attribute] = attributes[attribute]()
        if (attribute === "options") {
          for (let option in attributes["options"]) {
            if (typeof attributes["options"][option] === "function") {
              attributes["options"][option] = attributes["options"][option]()
            }
          }
        }
      }
    }

    if (!(typeof attributes["reader"] === "function"))
      attributes["reader"] = v => {return v};

    this.inputs.push({
      key: attributes.key,
      name: attributes.name,
      placeholder: attributes.placeholder,
      type: attributes.type,
      allowSkip: attributes.allowSkip,
      options: Form.updateOptions(attributes.type, attributes.options),
      value: attributes.value,
      defaultValue: attributes.value,
      hint: attributes.hint,
      checker: attributes.checker,
      candidates: attributes.candidates,
      reader: attributes.reader,
      readableText: null,
    })
    return this
  }

  reset() {
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].value = this.inputs[i].defaultValue
    }
  }

  onload() {
    for (let i = 0; i < this.inputs.length; i++) {
      let input = this.inputs[i]
      input.readableText = input.reader(input.value);
    }
  }
}

export {Form, FormPage}