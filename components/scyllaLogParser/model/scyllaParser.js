const parseString = require('xml2js').parseString

const log = console

module.exports = (input) => {

  const executionPlan = {
    repetitions: 1,
    nodes: [],
  }

  const nodes = {

  }
  let minDate = 'Z'
  parseString(input, {trim: true}, (error, result) => {
    const eventLog = result.log.trace
      .map(trace => trace.event.filter(event => event.string.length === 4))

    eventLog.forEach(instance => {
      instance.forEach(event => {
        try {
          const node = event.string.find(key => key.$.key === 'org:resource').$.value
          const date = event.date[0].$.value
          const size = parseFloat(event.string.find(key => /.*\.payload/.test(key.$.key)).$.value)
          minDate = [minDate, date].sort()[0]
          if (nodes[node]) {
            nodes[node].push({date, size})
          }
          else {
            nodes[node] = [{date, size}]
          }
        }
        catch (parseError) {
          log.info(parseError.message)
        }
      })
    })

    /* eslint-disable array-callback-return */
    Object.keys(nodes)
      .forEach(key => {
        nodes[key] = nodes[key].sort((valueA, valueB) => {
          if (new Date(valueA.date) < new Date(valueB.date)) {
            return -1
          }
          if (new Date(valueA.date) === new Date(valueB.date)) {
            if (valueA.size < valueB.size) {
              return -1
            }
            if (valueA.size === valueB.size) {
              return 0
            }
            if (valueA.size > valueB.size) {
              return 1
            }
          }
          if (new Date(valueA.date) > new Date(valueB.date)) {
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

    Object.keys(nodes)
      .map(item => {
        return nodes[item] = nodes[item].reduce((list, object, index, elements) => {
          if (index === 0) {
            object.quantity = 1
          }
          else {
            const last = elements[index - 1]
            if (object.date === last.date && object.size === last.size) {
              list[list.length - 1].quantity ++
              return list
            }
            object.quantity = 1
          }
          return list.concat(object)
        }, [])
      })

    executionPlan.nodes = Object.keys(nodes)
      .map(key => ({name: key, transactions: nodes[key]}))

  })
  return executionPlan
}
