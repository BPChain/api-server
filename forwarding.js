const execa = require('execa')

const log = console

async function forward () {
  let result = await execa('nc', ['-l', '172.18.0.1', '3031'])
  log.info('new data incoming')
  result = result.stdout.toString()
  let json = result
    .match(/{"hostId":.*/)[0]
  json = JSON.stringify(json)
  log.info(json)
  const formattedData = await execa.shell(
    `echo ${json} | wscat ws://localhost:3030`
  )
  if (formattedData) {
    return 0
  }
}

async function listen () {
  const listening = true

  while (listening) {
    await forward()
  }
}

listen()


