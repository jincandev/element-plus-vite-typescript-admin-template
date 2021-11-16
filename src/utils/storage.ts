import _ from "lodash"
import Cookiejs from "js-cookie"

export const Storage = {
  /**
   * 保存到localStorage
   * @param {string} key
   * @param {any} val
   * @returns
   */
  set(key: string, val: any) {
    if (_.isUndefined(val)) {
      return this.del(key)
    }
    if (!_.isPlainObject(val)) {
      val = {
        "##VAL": val
      }
    }
    val = JSON.stringify(val)
    localStorage.setItem(key, val)
  },
  get(key: string) {
    let res: any = localStorage.getItem(key)
    if (!res) {
      return null
    }
    try {
      res = JSON.parse(res)
    } catch (e) {
      return res
    }
    return res["##VAL"] === undefined ? res : res["##VAL"]
  },
  del(key: string) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  },
  setTTL(key: string, val: any, ttl: number = -1) {
    if (_.isUndefined(val)) {
      return this.del(key)
    }
    val = {
      "##VAL": val
    }
    ttl = parseInt(ttl as any)
    if (ttl > 0) {
      val.__expires = Date.now() + ttl
    }
    return this.set(key, val)
  },
  getTTL(key: string) {
    let res: any = localStorage.getItem(key)
    if (!res) {
      return null
    }
    try {
      res = JSON.parse(res)
    } catch (e) {
      return res
    }
    if (res.__expires && res.__expires < Date.now()) {
      this.del(key) //如果已经过期，则删除当前键
      return null
    }
    return res["##VAL"] || res
  }
}

export const SessionStorage = {
  set(key: string, val: any) {
    if (_.isUndefined(val)) {
      return this.del(key)
    }
    if (!_.isPlainObject(val)) {
      val = {
        "##VAL": val
      }
    }
    val = JSON.stringify(val)
    sessionStorage.setItem(key, val)
  },
  get(key: string) {
    let res: any = sessionStorage.getItem(key)
    if (!res) {
      return null
    }
    try {
      res = JSON.parse(res)
    } catch (e) {
      return res
    }
    return res["##VAL"] || res
  },
  del(key: string) {
    sessionStorage.removeItem(key)
  },
  clear() {
    sessionStorage.clear()
  }
}

export const Cookie = {
  set(key: string, val: any) {
    Cookiejs.set(key, val)
  },
  get(key: string) {
    return Cookiejs.get(key)
  }
}

export default Storage
