module.exports = ({payloadSize, period, numberOfNodes}) => {

  const nodes = []
  for (let index = 0; index < numberOfNodes; index++) {
    nodes.push({
      name: index,
      transactions: [{
        delta: period,
        size: payloadSize,
        quantity: 1,
      }],
    })
  }

  return {
    repetitions: Infinity,
    nodes,
  }
}
