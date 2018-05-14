/*
  Holds state of active chain and checks if valid chain is selected
*/

const Schema = require('mongoose').Schema

const recordSchema = new Schema({
  recordingName: {type: String},
  startTime: {type: Number},
  endTime: {type: Number},
  chains: {type: []},
})

module.exports = class ActiveChains {

  constructor ({config, connection, log}) {
    this.clientInfos = []
    this.log = log
    this.config = config
    this.connection = connection
    this.emptyScenario = {name: 'noScenario', period: 0, payloadSize: 0}
    this.backendState = {
      /*
        'rx600s5-2': {
          'ethereum': {
            miners: 0,
            hosts: 0,
          },
        }
      */
    }
    this.backendScenario = {
      /*
        'rx600s5-2': {
          'ethereum': {
            name: 'someName',
            period: 2.3,
            payloadSize: 222
          },
        }
      */
    }

    this.isRecording = false
    this.recordingName = ''
    this.startTime = 0

  }

  setScenario ({chainName, target, scenario}) {
    this.backendScenario[target] = {}
    this.backendScenario[target][chainName] = scenario
  }

  getScenario ({chainName, target}) {
    try {
      return this.backendScenario[target][chainName]
    }
    catch (error) {
      return undefined
    }
  }

  getActiveChains () {
    return Object.keys(this.backendState)
      .reduce((result, target) => {
        return result.concat(Object.keys(this.getState({monitor: target}))
          .map(chainName => {
            return this.isChainActive({monitor: target, chainName})
              ? {target, chainName, state: this.getState({monitor: target})[chainName]}
              : null
          })
          .filter(Boolean)
        )
      }, [])
  }

  getState ({monitor}) {
    return this.backendState[monitor] || {}
  }

  getBackendState ({monitor, chainName}) {
    try {
      return this.backendState[monitor][chainName]
    }
    catch (error) {
      return {
        miners: 0,
        hosts: 0,
      }
    }
  }

  setState ({monitor, state}) {
    this.backendState[monitor] = state
  }

  removeMonitor ({monitor}) {
    this.backendState[monitor] = {}
  }

  isChainActive ({monitor, chainName}) {
    try {
      const chainInfo = this.getBackendState({monitor, chainName})
      return chainInfo.hosts !== 0 || chainInfo.miners !== 0
    }
    catch (error) {
      return false
    }
  }

  startRecording () {
    return (request, response) => {
      const requestedName = request.body.name
      this.log.debug('Requesting', requestedName)
      if (this.isRecording) {
        this.log.debug('already recording')
        return response.status(500)
          .send('A recording is already in progress')
      }
      this.log.debug('starting recording')
      this.isRecording = true
      this.recordingName = requestedName
      this.startTime = Date.now()

      return response.sendStatus(200)
    }
  }

  intializeRecordInfoStorage () {
    return this.connection.model('recording_infos', recordSchema)
  }

  createRecordInfoStorage ({Storage, name}) {
    this.log.debug('creating recording storage')
    return new Storage({
      recordingName: name,
      startTime: this.startTime,
      endTime: Date.now(),
      chains: this.clientInfos,
    })
  }

  saveRecordingToDatabase ({nameToStore}) {
    const Storage = this.intializeRecordInfoStorage()
    const dataLine = this.createRecordInfoStorage({Storage, name: nameToStore})

    dataLine.save((error, savedData) => {
      if (error) {
        this.log.error(`Error occured while storing record metadata: ${error}`)
        throw error
      }
      else {
        this.log.debug('Successfully stored recorded meatadata')
        this.log.debug(`Stored record metadata: ${savedData}`)
      }
    })
  }

  getListOfRecordings () {
    return async (request, response) => {
      const RecordInfoStorage = this.intializeRecordInfoStorage()
      await new Promise((resolve) => {
        RecordInfoStorage.find({}, (error, info) => {
          if (error) {
            response.send(500)
            return resolve()
          }
          response.send(info)
          return resolve()
        })
      })
    }
  }

  stopRecording () {
    return (request, response) => {
      this.log.debug('stopping recording')
      this.log.debug(this.recordingName)
      this.saveRecordingToDatabase({nameToStore: this.recordingName})
      this.isRecording = false
      this.recordingName = ''
      this.startTime = 0
      return response.sendStatus(200)
    }
  }

  cancelRecording () {
    return (request, response) => {
      this.log.debug('cancel recording')
      this.log.debug(this.recordingName)
      this.isRecording = false
      this.recordingName = ''
      this.startTime = 0
      return response.sendStatus(200)
    }
  }

  isRecordingActive () {
    return (request, response) => {
      return response.send(JSON.stringify({
        creationDate: this.startTime,
        isRecording: this.isRecording,
        recordingName: this.recordingName,
      }))
    }
  }
}
