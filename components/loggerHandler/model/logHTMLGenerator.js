const Handlebars = require('handlebars')
const logLevels = {
  10: '<td style="color:#0066ff;">trace</td>',
  20: '<td style="color:#009933;">debug</td>',
  30: '<td style="color:#756647;">info</td>',
  40: '<td style="color:#ff9900;">warn</td>',
  50: '<td style="color:#ff0000;">error</td>',
  60: '<td style="color:#800000;">fatal</td>',
}
const lineTemplate = Handlebars.compile(`
<tr>
  <td>{{{timeStamp}}}</td>
  {{logLevelLine}}
  <td>{{{message}}}</td>
</tr>
`)
const siteTemplate = Handlebars.compile(`
  <!DOCTYPE html>
  <HTML>
    <HEAD>
      <style>
        td {
          font-family: "Arial", Sans-serif;
        }
      </style>
    </HEAD>
    <BODY style="font-family:verdana;">
      <table>
      {{logLines}}
      </table>
    </BODY>
  </HTML>
`)

module.exports = ({data}) => {
  const logLines = new Handlebars.SafeString(
    data.reduce((html, logEntry) => {
      const logLevelLine = new Handlebars.SafeString(
        logLevels[logEntry.logLevel] || logLevels[10]
      )
      const htmlLine = lineTemplate({
        timeStamp: logEntry.timeStamp,
        logLevelLine,
        message: Handlebars.Utils.escapeExpression(logEntry.log),
      })
      return `${html}${htmlLine}`
    }, '')
  )
  return siteTemplate({logLines})
}
