const fs = require('fs')
const parseString = require('xml2js').parseString


module.exports = () => {
  const input = fs.readFileSync('/home/tom/Desktop/mango.xes', 'utf8')

  /*
  const executionPlan = {
    repetitions: 1,
    nodes: [],
  }
  */

  const nodes = {

  }

  parseString(input, {trim: true}, (error, result) => {
    const eventLog = result.log.trace.map(trace => {
      return trace.event.filter(event => event.string.length === 4)
    })

    const instance = eventLog[0]

    instance.forEach(event => {
      const node = event.string.find(key => key.$.key === 'org:resource').$.value
      const date = event.date[0].$.value
      if (nodes[node]) {
        nodes[node].push({date, size: 5}) // size = key: /.*\.payload$/
      }
      else {
        nodes[node] = [{date, size: 5}]
      }
    })
  })
}
