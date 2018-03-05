/*
  A helper that contains some logic from the listener to make things easier to read
*/

module.exports = class DoubleBuffer {
  constructor ({connection, activeChain, Schema, StorageSchema, log}) {
    this.log = log
    this.StorageSchema = StorageSchema
    this.connection = connection
    this.activeChain = activeChain
    this.Schema = Schema

    this.bufferA = this.createBuffer('a')
    this.bufferB = this.createBuffer('b')

    this.activeBuffer = this.bufferA
    this.isBufferA = true
  }

  createBuffer = (bufferName) => {
    return this.connection.model(
      `${this.activeChain.get()}_private_buffer_${bufferName.toLowerCase()}`,
      this.Schema,
    )
  }

  getActiveBuffer = () => this.activeBuffer

  getActiveBufferLabel = () => this.isBufferA ? 'a' : 'b'

  getInactiveBufferLabel = () => this.isBufferA ? 'b' : 'a'

  toggleActiveBuffer = () => {
    if (this.isBufferA) {
      this.isBufferA = false
      this.activeBuffer = this.BufferB
    }
    else {
      this.isBufferA = true
      this.activeBuffer = this.BufferA
    }
    this.log.trace(`Changed Buffer to Buffer ${this.getActiveBufferLabel()}`)
  }

  aggregateBuffer = (bufferAggregator) => {
    bufferAggregator({
      filledBufferName: `_buffer_${this.getInactiveBufferLabel()}`,
      chainName: this.activeChain.get(),
      Schema: this.Schema,
      StorageSchema: this.StorageSchema,
      connection: this.connection,
      log: this.log,
    })
  }
}
