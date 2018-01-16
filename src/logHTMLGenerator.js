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
  let color = '000000'

  data.forEach(log => {
    switch (log.logLevel) {
    case 'trace': {
      color = '0066ff'
    } break
    case 'debug': {
      color = '009933'
    } break
    case 'info': {
      color = '000000'
    } break
    case 'warn': {
      color = 'ff9900'
    } break
    case 'error': {
      color = 'ff0000'
    } break
    case 'fatal': {
      color = '800000'
    } break
    default: {color = '000000'}
    }

    html += `<tr>
        <td>${log.timeStamp}</td>
        <td style='color:#${color};'>${log.logLevel}</td>
        <td>${log.log}</td>
      </tr>`

  })


  html += `</table>
    </BODY>
  </HTML>`


  return html
}
