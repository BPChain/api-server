const bufferAggregator = require('../model/bufferAggregator')
const validContent = require('../model/checkJsonContent')
const DoubleBuffer = require('../model/DoubleBuffer')
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
      try {
        if (validContent(request.body)) {
          this.doubleBuffer.storeIncomingData(request.body)
          response.sendStatus(200)
        }
        else {
          throw new Error(`JSON has wrong content: ${JSON.stringify(request.body)}`)
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
