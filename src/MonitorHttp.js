import HttpMap from './HttpMap'
import dayjs from 'dayjs'

const { open, send, setRequestHeader } = XMLHttpRequest.prototype

export default class MonitorHttp {

  static #instance

  #httpMap

  #listenList

  constructor() {
    this.#httpMap = new HttpMap()
    this.#listenList = []
    this.#interceptOpen()
    this.#interceptSend()
    this.#interceptSetRequestHeader()
  }

  #interceptOpen() {
    let that = this
    XMLHttpRequest.prototype.open = function (method, url, async) {
      let data = {
        method,
        url,
        startTime: dayjs().valueOf(),
        headers:{}
      }
      that.#httpMap.set(this, data)
      return open.call(this, method, url, async)
    }
  }

  #interceptSetRequestHeader() {
    let that = this
    XMLHttpRequest.prototype.setRequestHeader = function (...arg) {
      let [key,value] = arg
      let data = that.#httpMap.get(this)
      data.headers[key] = value
      that.#httpMap.set(this, data)
      return setRequestHeader.call(this, ...arg)
    }
  }

  #interceptSend() {
    let that = this
    XMLHttpRequest.prototype.send = function (body) {
      let readystatechange = (e) => {
        if (this.readyState == 4) {
          this.removeEventListener('readystatechange', readystatechange)
          let { currentTarget } = e
          let time = dayjs().valueOf()
          let data = that.#httpMap.get(currentTarget)
          data.requestBody = body
          data.currentTarget = currentTarget
          data.endTime = time
          data.duration = time - data.startTime
          that.#notice(data)
        }
      }
      this.addEventListener('readystatechange', readystatechange)

      return send.call(this, body)
    }
  }

  listen(fun) {
    let length = this.#listenList.push(fun)
    let index = length - 1
    return {
      index,
      clear: this.#clear.bind(this, index),
    }
  }

  #clear(index) {
    this.#listenList[index] = undefined
  }
  
  #notice(data) {
    this.#listenList.forEach((fun) => {
      fun && fun(data)
    })
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MonitorHttp()
    }
    return this.#instance
  }
}
