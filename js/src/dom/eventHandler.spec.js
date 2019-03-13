import EventHandler from './eventHandler'

/** Test helpers */
import { getFixture, clearFixture } from '../../tests/helpers/fixture'

describe('EventHandler', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('on', () => {
    it('should not add event listener if the event is not a string', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      EventHandler.on(div, null, () => {})
      EventHandler.on(null, 'click', () => {})

      expect().nothing()
    })

    it('should add event listener', done => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      EventHandler.on(div, 'click', () => {
        expect().nothing()
        done()
      })

      div.click()
    })

    it('should add namespaced event listener', done => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      EventHandler.on(div, 'bs.namespace', () => {
        expect().nothing()
        done()
      })

      EventHandler.trigger(div, 'bs.namespace')
    })

    it('should add native namespaced event listener', done => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      EventHandler.on(div, 'click.namespace', () => {
        expect().nothing()
        done()
      })

      EventHandler.trigger(div, 'click')
    })

    it('should handle event delegation', done => {
      EventHandler.on(document, 'click', '.test', () => {
        expect().nothing()
        done()
      })

      fixtureEl.innerHTML = '<div class="test"></div>'

      const div = fixtureEl.querySelector('div')

      div.click()
    })
  })

  describe('one', () => {
    it('should call listener just one', done => {
      fixtureEl.innerHTML = '<div></div>'

      let called = 0
      const div = fixtureEl.querySelector('div')
      const obj = {
        oneListener() {
          called++
        }
      }

      EventHandler.one(div, 'bootstrap', obj.oneListener)

      EventHandler.trigger(div, 'bootstrap')
      EventHandler.trigger(div, 'bootstrap')

      setTimeout(() => {
        expect(called).toEqual(1)
        done()
      }, 20)
    })
  })

  describe('off', () => {
    it('should not remove a listener', () => {
      fixtureEl.innerHTML = '<div></div>'
      const div = fixtureEl.querySelector('div')

      EventHandler.off(div, null, () => {})
      EventHandler.off(null, 'click', () => {})
    })

    it('should remove a listener', done => {
      fixtureEl.innerHTML = '<div></div>'
      const div = fixtureEl.querySelector('div')

      let called = 0
      const handler = () => {
        called++
      }

      EventHandler.on(div, 'foobar', handler)
      EventHandler.trigger(div, 'foobar')

      EventHandler.off(div, 'foobar', handler)
      EventHandler.trigger(div, 'foobar')

      setTimeout(() => {
        expect(called).toEqual(1)
        done()
      }, 20)
    })

    it('should remove all the events', done => {
      fixtureEl.innerHTML = '<div></div>'
      const div = fixtureEl.querySelector('div')

      let called = 0

      EventHandler.on(div, 'foobar', () => {
        called++
      })
      EventHandler.on(div, 'foobar', () => {
        called++
      })
      EventHandler.trigger(div, 'foobar')

      EventHandler.off(div, 'foobar')
      EventHandler.trigger(div, 'foobar')

      setTimeout(() => {
        expect(called).toEqual(2)
        done()
      }, 20)
    })

    it('should remove all the namespaced listeners if namespace is passed', done => {
      fixtureEl.innerHTML = '<div></div>'
      const div = fixtureEl.querySelector('div')

      let called = 0

      EventHandler.on(div, 'foobar.namespace', () => {
        called++
      })
      EventHandler.on(div, 'foofoo.namespace', () => {
        called++
      })
      EventHandler.trigger(div, 'foobar.namespace')
      EventHandler.trigger(div, 'foofoo.namespace')

      EventHandler.off(div, '.namespace')
      EventHandler.trigger(div, 'foobar.namespace')
      EventHandler.trigger(div, 'foofoo.namespace')

      setTimeout(() => {
        expect(called).toEqual(2)
        done()
      }, 20)
    })

    it('should remove the namespaced listeners', () => {
      fixtureEl.innerHTML = '<div></div>'
      const div = fixtureEl.querySelector('div')

      let calledCallback1 = 0
      let calledCallback2 = 0

      EventHandler.on(div, 'foobar.namespace', () => {
        calledCallback1++
      })
      EventHandler.on(div, 'foofoo.namespace', () => {
        calledCallback2++
      })

      EventHandler.trigger(div, 'foobar.namespace')
      EventHandler.off(div, 'foobar.namespace')
      EventHandler.trigger(div, 'foobar.namespace')

      EventHandler.trigger(div, 'foofoo.namespace')

      setTimeout(() => {
        expect(calledCallback1).toEqual(1)
        expect(calledCallback2).toEqual(1)
      }, 20)
    })
  })
})
