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
    const nthLine = parseInt(lines.length / numberOfItems, 10) + 1
    reducedLines = lines.filter((value, index) => {
      return index % nthLine === 0
    })
  }

  return reducedLines
}
