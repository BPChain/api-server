const bufferAggregator = require('../model/bufferAggregator')
const isValidJson = require('../model/checkJsonContent')
const DoubleBuffer = require('../model/doubleBuffer')
const StorageSchema = require('../model/ethereumStorage')
const Schema = require('../model/ethereumSchema')

module.exports = class DataCollector {
  constructor ({activeChains, log, config, connection}) {
    this.log = log
    this.doubleBuffer = new DoubleBuffer({
      activeChains,
      bufferAggregator,
      log,
      config,
      connection,
      Schema,
      StorageSchema,
    })
  }

  storeMessage () {
    return (request, response) => {
      const body = request.body
      try {
        if (isValidJson({json: body})) {
          this.doubleBuffer.storeIncomingData(body)
          response.sendStatus(200)
        }
        else {
          throw new Error(`JSON has wrong content: ${JSON.parse(body)}`)
        }
      }
      catch (error) {
        this.log.error(`While receiving private data: ${error}`)
        response.sendStatus(415)
      }
    }
  }

  stopBuffer () {
    this.doubleBuffer.stopBufferInterval()
  }
}
