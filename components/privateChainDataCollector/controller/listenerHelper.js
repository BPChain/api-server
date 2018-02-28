/*
  A helper that contains some logic from the listener to make things easier to read
*/


let isBufferA = true

let currentBuffer = {}

exports.createBuffer = function (connection, activeChain, Schema, bufferName) {
  return connection.model(
    `${activeChain.get()}_private_buffer_${bufferName.toLowerCase()}`,
    Schema,
  )
}

exports.isBufferAActive = function () {
  if (isBufferA) return true
  else return false
}

exports.setBufferAActive = function (bufferAActivity) {
  isBufferA = bufferAActivity
}

exports.setCurrentBuffer = function (bufferToBeActive) {
  currentBuffer = bufferToBeActive
}

exports.getCurrentBuffer = function () {
  return currentBuffer
}

exports.aggregateBuffer = function (bufferToAggregate, bufferAggregator,
  activeChain, Schema, StorageSchema, connection, log) {
  const buffer =  `_buffer_${bufferToAggregate.toLowerCase()}`
  bufferAggregator({
    chainName: activeChain.get(),
    filledBuffer: buffer,
    Schema,
    StorageSchema,
    connection,
    log,
  })
}
