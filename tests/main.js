const privateChains = require('./modules/privateChains/main')
const publicChains = require('./modules/publicChains/main')

const log = console

async function runTests () {
  log.info('+++ Start Unit-Tests +++')

  await Promise
    .all([
      privateChains(),
      publicChains(),
    ])
    .catch(error => {
      log.error(error)
      process.exit(1)
    })

  log.info('+++ Unit-Tests finished +++')
}

runTests()
