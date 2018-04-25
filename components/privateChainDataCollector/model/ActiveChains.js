/*
  Holds state of active chain and checks if valid chain is selected
*/

const Schema = require('mongoose').Schema

const recordSchema = new Schema({
  recordingName: {type: String},
  startTime: {type: Number},
  endTime: {type: Number},
})


module.exports = class ActiveChains {

  constructor ({config, connection}) {
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
      const {
        recordingName,
      } = request.body

      if (this.isRecording) {
        console.info('already recording')
        return response.status(500)
          .send('A recording is already in progress')
      }
      console.info('starting recording')
      this.isRecording = true
      this.recordingName = recordingName
      this.startTime = Date.now()

      return response.sendStatus(200)
    }
  }

  intializeRecordInfoStorage () {
    return this.connection.model('recording_infos', recordSchema)
  }

  createRecordInfoStorage ({recordingName, Storage}) {
    console.log('creating recording storage')
    return new Storage({
      recordingName,
      startTime: this.startTime,
      endTime: Date.now()}
    )
  }

  saveRecordingToDatabase ({recordingName}) {
    const Storage = this.intializeRecordInfoStorage()
    const dataLine = this.createRecordInfoStorage({recordingName, Storage})

    dataLine.save((error, savedData) => {
      if (error) {
        console.error(`Error occured while storing record metadata: ${error}`)
        throw error
      }
      else {
        console.info('Successfully stored recorded meatadata')
        console.debug(`Stored record metadata: ${savedData}`)
      }
    })
  }

  stopRecording () {
    return (request, response) => {
      console.info('stopping recording')
      this.saveRecordingToDatabase({recordingName: this.recordingName})
      this.isRecording = false
      this.recordingName = ''
      this.startTime = 0
      return response.sendStatus(200)
    }
  }
}
