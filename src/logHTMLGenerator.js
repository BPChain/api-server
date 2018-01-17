module.exports = async (options = {}) => {
  const {data} = options
  let html = `<!DOCTYPE html>
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
    `
  let logLevelLine = '<td style="color:#0066ff";>trace</td>'

  data.forEach(log => {
    switch (log.logLevel) {
    case 10: {
      logLevelLine = '<td style="color:#0066ff";>trace</td>'
    } break
    case 20: {
      logLevelLine = '<td style="color:#009933";>debug</td>'
    } break
    case 30: {
      logLevelLine = '<td style="color:#756647";>info</td>'
    } break
    case 40: {
      logLevelLine = '<td style="color:#ff9900";>warn</td>'
    } break
    case 50: {
      logLevelLine = '<td style="color:#ff0000";>error</td>'
    } break
    case 60: {
      logLevelLine = '<td style="color:#800000";>fatal</td>'
    } break
    default: {
      logLevelLine = '<td style="color:#0066ff";>trace</td>'
      break
    }
    }

    html += `<tr>
        <td>${log.timeStamp}</td>
        ${logLevelLine}
        <td>${log.log}</td>
      </tr>`

  })


  html += `</table>
    </BODY>
  </HTML>`


  return html
}
