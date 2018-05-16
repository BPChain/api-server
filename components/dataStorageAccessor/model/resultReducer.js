module.exports = async (options = {}) => {
  let {numberOfItems} = options
  const {lines} = options
  if (!numberOfItems || numberOfItems > 10000) {
    numberOfItems = 10000
  }

  let reducedLines = []

  if (lines.length <= numberOfItems) {
    reducedLines = lines
  }
  else {
    const nthLine = Math.floor( lines.length / numberOfItems)

    reducedLines = lines.filter((value, index) => (index % nthLine) === 0)

    reducedLines.forEach((line, index) => {
      let numberOfHosts = line.numberOfHosts
      let numberOfMiners = line.numberOfMiners
      let avgHashrate = line.avgHashrate
      let avgBlocktime = line.avgBlocktime
      let avgBlockSize = line.avgBlockSize
      let avgDifficulty = line.avgDifficulty
      let avgCpuUsage = line.avgCpuUsage

      for (let neighbourIndex = index + 1; neighbourIndex < index + nthLine; neighbourIndex++) {
        numberOfHosts += lines[neighbourIndex].numberOfHosts
        numberOfHosts /= 2
        numberOfMiners += lines[neighbourIndex].numberOfMiners
        numberOfMiners /= 2
        avgHashrate += lines[neighbourIndex].avgHashrate
        avgHashrate /= 2
        avgBlocktime += lines[neighbourIndex].avgBlocktime
        avgBlocktime /= 2
        avgBlockSize += lines[neighbourIndex].avgBlockSize
        avgBlockSize /= 2
        avgDifficulty += lines[neighbourIndex].avgDifficulty
        avgDifficulty /= 2
        avgCpuUsage += lines[neighbourIndex].avgCpuUsage
        avgCpuUsage /= 2
      }
      reducedLines[index] = {
        numberOfHosts,
        numberOfMiners,
        avgHashrate,
        avgBlocktime,
        avgBlockSize,
        avgDifficulty,
        avgCpuUsage,
      }
    })

  }
  if (numberOfItems < reducedLines.length) {
    // reducedLines.length = numberOfItems
    reducedLines = reducedLines.slice(0, numberOfItems)
  }
  return reducedLines
}
