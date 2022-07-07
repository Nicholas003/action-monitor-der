export default class HttpMap{
  #httpMap;
  constructor(){
    this.#httpMap = new Map()
  }
  get(key){
    return this.#httpMap.get(key)
  }
  set(key,value){
    this.#httpMap.set(key,value)
    return this
  }
  clear(){
    this.clear()
    return this
  }
  delete(key=undefined){
    if(key!==undefined){
      this.#httpMap.delete(key)
    }
    return this
  }
  
}