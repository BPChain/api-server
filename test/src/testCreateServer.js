/* eslint-disable max-len */

const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')
const createServer = require('../../src/createServer')
const config = require('../../config')
const log = {
  debug: () => {},
  info: () => {},
  error: () => {},
  warn: () => {},
}
const connection = {
  model: () => {
    return class Storage {
      static aggregate ()  {
        return {
          exec: () => {
            return []
          },
        }
      }
      lines () {}
      save (callbackFunction)  {
        callbackFunction(false, true)
      }
      static get collection () {
        return {
          find: () => {
            return {
              limit: () => {
                return {
                  sort: () => {},
                }
              },
            }
          },
          remove: () => {},
        }
      }
      static findOne (object, callbackFunction) {
        callbackFunction(false, true)
      }
      static findOneAndUpdate (query, user, opts, callbackFunction) {
        callbackFunction(false, true)
      }
    }
  },
}

describe('Create Server', () => {
  describe('Test create Server', () => {
    it('should return valid object with correct components', async () => {
      const server = createServer({
        activeChainName: 'ethereum',
        connection,
        config,
        log,
      })
      const keys = [
        'privateChainConfigurator',
        'privateChainCollector',
        'publicChainCollector',
        'frontendRouting',
      ]
      assert.deepEqual(Object.keys(server), keys)
      clearInterval(server.publicChainCollector)
      server.privateChainCollector.then(result => {
        result.wsServer.close()
        result.doubleBuffer.stopBufferInterval()
      })
      server.privateChainConfigurator.close()
      server.frontendRouting.close()

    })
  })
})
