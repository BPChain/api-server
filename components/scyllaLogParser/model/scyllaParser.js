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
  let minDate = 'Z'
  parseString(input, {trim: true}, (error, result) => {
    const eventLog = result.log.trace
      .map(trace => trace.event.filter(event => event.string.length === 4))

    eventLog.forEach(instance => {
      instance.forEach(event => {
        const node = event.string.find(key => key.$.key === 'org:resource').$.value
        const date = event.date[0].$.value
        minDate = [minDate, date].sort()[0]
        if (nodes[node]) {
          nodes[node].push({date, size: 5}) // size = key: /.*\.payload$/
        }
        else {
          nodes[node] = [{date, size: 5}]
        }
      })
    })

    Object.keys(nodes)
      .forEach(key => {
        nodes[key] = nodes[key].sort((a, b) => {
          if (new Date(a.date) < new Date(b.date)) {
            return -1
          }
          if (new Date(a.date) === new Date(b.date)) {
            return 0
          }
          if (new Date(a.date) > new Date(b.date)) {
            return 1
          }
        })
      })

    Object.keys(nodes)
      .map(item => {
        return nodes[item] = nodes[item].reduce((list, object, index, elements) => {
          if (index === 0) {
            object.delta = new Date(object.date) - new Date(minDate)
          }
          else {
            object.delta =  new Date(object.date) - new Date(elements[index - 1].date)
          }
          return list.concat(object)
        }, [])
      })
  })
}
