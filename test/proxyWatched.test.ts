import proxyWatched from '../src/index'

it('can be created empty', () =>
  expect(proxyWatched({}, () => {})).toBeTruthy())

it('reading, object works', () => {
  const s = proxyWatched({ x: { y: 1 } }, () => {})
  expect(typeof s.x).toEqual('object')
  expect(s.x.y).toEqual(1)
})

it('calls change notification when change is made', () => {
  const callback = jest.fn()
  const obj = { x: 1 }
  const s = proxyWatched(obj, callback)
  s.x = 2
  expect(callback).toHaveBeenCalled()
})

it('calls change notification when change is made deep', () => {
  const callback = jest.fn()
  const obj = { x: { y: 1 } }
  const s = proxyWatched(obj, callback)
  s.x.y = 2
  expect(callback).toHaveBeenCalled()
})

it('passes through change to obj', () => {
  const callback = jest.fn()
  const obj = { x: 1 }
  const s = proxyWatched(obj, callback)
  s.x = 2
  expect(obj.x).toEqual(2)
})

it('passes through change to deep obj', () => {
  const callback = jest.fn()
  const obj = { x: { y: 1 } }
  const s = proxyWatched(obj, callback)
  s.x.y = 2
  expect(obj.x.y).toEqual(2)
})

it('assigning an object makes it observed too', () => {
  const callback = jest.fn()
  const obj: any = {}
  const s = proxyWatched(obj, callback)
  s.x = {} // called once
  s.x.y = 1 // called twice
  expect(callback).toHaveBeenCalledTimes(2)
})

it('gets notified when prop deleted', () => {
  const callback = jest.fn()
  const obj: any = { x: 1 }
  const s = proxyWatched(obj, callback)
  delete s.x
  expect(callback).toHaveBeenCalledTimes(1)
})

it('notified when array index is assigned', () => {
  const callback = jest.fn()
  const arr: any = [1, 2]
  const s = proxyWatched(arr, callback)
  s[2] = '3'
  expect(callback).toHaveBeenCalledTimes(1)
})

it('supports being informed when arrays changes through method', () => {
  const callback = jest.fn()
  const arr: any[] = []
  const s = proxyWatched(arr, callback)
  const actions = [
    () => s.push('test'),
    () => s.sort(),
    () => s.reverse(),
    () => s.splice(0, 0),
    () => s.unshift('test0'),
    () => s.shift()
  ]
  actions.forEach((action, index) => {
    action()
    expect(callback).toHaveBeenCalledTimes(index + 1)
  })
})

it('watches arrays added after watching started', () => {
  const callback = jest.fn()
  const obj = {}
  const s = proxyWatched(obj, callback)
  s.names = []
  expect(callback).toHaveBeenCalledTimes(1)
  s.names.push('Bob')
  expect(callback).toHaveBeenCalledTimes(2)
})

it('still allows assignment if exception thrown in callback', () => {
  const obj: any = {}
  const s = proxyWatched(obj, () => {
    throw new Error('EXPECTED')
  })

  expect(() => {
    s.x = 1
  }).not.toThrow()
})
