const arrayMutators = [
  'pop',
  'push',
  'reverse',
  'shift',
  'unshift',
  'splice',
  'sort'
]

export default function proxyWatched (object: any, change: () => void) {
  let proxy = null

  proxy = new Proxy(object, {
    get (object, name) {
      // @ts-ignore
      if (Array.isArray(object) && arrayMutators.includes(name)) {
        return (...args: any[]) => {
          // @ts-ignore
          const result = Array.prototype[name].apply(object, args)
          emitChange()
          return result
        }
      }

      return object[name]
    },
    set (object, name, value) {
      if (value && typeof value === 'object') {
        value = proxyWatched(value, change)
      }
      object[name] = value
      emitChange()
      return true
    },
    deleteProperty (object, name) {
      delete object[name]
      change()
      return true
    }
  })

  function emitChange () {
    try {
      change()
    } catch (err) {
      // if an error occurs while processing the change event, console.log it but swallow it
      // we don't want to stop updates on objects from happening
      console.error(err)
    }
  }

  Object.keys(object).forEach(prop => {
    if (object[prop] && typeof object[prop] == 'object') {
      // deep watch objects and sub arrays in the array
      object[prop] = proxyWatched(object[prop], change)
    }
  })

  return proxy
}
