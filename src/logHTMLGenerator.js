module.exports = async (options = {}) => {
  const {data} = options
  const logLevels = {
    10: '<td style="color:#0066ff;">trace</td>',
    20: '<td style="color:#009933;">debug</td>',
    30: '<td style="color:#756647;">info</td>',
    40: '<td style="color:#ff9900;">warn</td>',
    50: '<td style="color:#ff0000;">error</td>',
    60: '<td style="color:#800000;">fatal</td>',
  }

  const logLines = data.reduce((html, logEntry) => {
    const logLevelLine =
      logLevels[logEntry.logLevel] ||
      '<td style="color:#0066ff;">trace</td>'

    return `${html}
      <tr>
        <td>${logEntry.timeStamp}</td>
        ${logLevelLine}
        <td>${logEntry.log}</td>
      </tr>`
  }, '')


  return `<!DOCTYPE html>
    <HTML>
      <HEAD>
        <style>
          td {
            font-family: "Arial", Sans-serif;
          }
        </style>
      </HEAD>
      <BODY style='font-family:verdana;'>
        <table>
        ${logLines}
        </table>
        </BODY>
    </HTML>`
}
