const parseString = require('xml2js').parseString


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
          const size = event.string.find(key => /.*\.payload/.test(key.$.key)).$.value
          minDate = [minDate, date].sort()[0]
          if (nodes[node]) {
            nodes[node].push({date, size: size})
          }
          else {
            nodes[node] = [{date, size: size}]
          }
        }
        catch (parseError) {
          console.info(parseError.message)
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
            if (a.size < b.size) {
              return -1
            }
            if (a.size === b.size) {
              return 0
            }
            if (a.size > b.size) {
              return 1
            }
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

    Object.keys(nodes)
      .forEach(key => {
        executionPlan.nodes.push({name: key, transactions: nodes[key]})
      })

  })
  return executionPlan
}