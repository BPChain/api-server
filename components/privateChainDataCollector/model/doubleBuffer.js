/*
  A helper that contains some logic from the listener to make things easier to read
*/

module.exports = class DoubleBuffer {
  constructor ({activeChains, bufferAggregator, config, connection, log, Schema, StorageSchema}) {
    this.activeChains = activeChains
    this.bufferSwitchTime = config.bufferSwitchTime
    this.connection = connection
    this.log = log
    this.StorageSchema = StorageSchema
    this.Schema = Schema

    this.bufferA = this.createBuffer('a')
    this.bufferB = this.createBuffer('b')

    this.activeBuffer = this.bufferA
    this.isBufferA = true

    this.interval = setInterval(() => {
      this.toggleActiveBuffer()
      this.aggregateBuffer(bufferAggregator)
    }, config.bufferSwitchTime)
  }

  createBuffer (bufferName) {
    return this.connection.model(
      `common_private_buffer_${bufferName.toLowerCase()}`,
      this.Schema,
    )
  }

  getActiveBuffer () {
    return this.activeBuffer
  }

  getActiveBufferLabel () {
    return this.isBufferA ? 'a' : 'b'
  }

  getInactiveBufferLabel () {
    return  this.isBufferA ? 'b' : 'a'
  }

  stopBufferInterval () {
    clearInterval(this.interval)
  }

  toggleActiveBuffer () {
    if (this.isBufferA) {
      this.isBufferA = false
      this.activeBuffer = this.bufferB
    }
    else {
      this.isBufferA = true
      this.activeBuffer = this.bufferA
    }
  }

  aggregateBuffer (bufferAggregator) {
    this.activeChains.getActiveChains()
      .forEach(item => {
        bufferAggregator({
          filledBufferName: `_buffer_${this.getInactiveBufferLabel()}`,
          chainName: item.chainName,
          target: item.target,
          Schema: this.Schema,
          StorageSchema: this.StorageSchema,
          connection: this.connection,
          log: this.log,
          isRecording: this.activeChains.isRecording,
        })
      })
    if (this.activeChains.getActiveChains().length) {
      this.log.info(
        `Aggregated ${this.activeChains.getActiveChains().length} active private chains`
      )
    }
  }

  storeIncomingData (privateData) {
    const BufferToStore = this.getActiveBuffer()
    const dataset = new BufferToStore(privateData)
    dataset.save()
  }
}
