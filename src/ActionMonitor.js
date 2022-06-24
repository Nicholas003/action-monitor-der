import MonitorHttp from './MonitorHttp.js'

export default class ActionMonitor {
  #monitorHttp;
  info;
  constructor(info){
    this.setInfo(info)
  }
  start(){
    this.#monitorHttp = MonitorHttp.getInstance()
    return this
  }
  setInfo(info){
    this.info = info
    return this
  }
  listen(fun){
    return this.#monitorHttp.listen(fun.bind({},this.info))
  }
}