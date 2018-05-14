const fs = require('fs')
const path = require('path')

const testLogs = {

  /* eslint-disable max-len */
  expectedResult: '{"repetitions":1,"nodes":[{"name":"mangoFarmer_#0","transactions":[{"date":"2018-05-07T13:51:33.436+02:00","size":"30","delta":0,"quantity":1},{"date":"2018-05-07T13:52:13.436+02:00","size":"30","delta":40000,"quantity":1},{"date":"2018-05-07T13:52:53.436+02:00","size":"30","delta":40000,"quantity":1}]},{"name":"airlineStaff_#0","transactions":[{"date":"2018-05-07T13:52:23.436+02:00","size":"10","delta":50000,"quantity":1}]},{"name":"mangoFarmer_#1","transactions":[{"date":"2018-05-07T13:51:53.436+02:00","size":"30","delta":20000,"quantity":1},{"date":"2018-05-07T13:52:33.436+02:00","size":"30","delta":40000,"quantity":1}]},{"name":"shipStaff_#0","transactions":[{"date":"2018-05-07T13:53:33.436+02:00","size":"10","delta":120000,"quantity":1},{"date":"2018-05-07T13:55:13.436+02:00","size":"10","delta":100000,"quantity":1},{"date":"2018-05-07T13:56:53.436+02:00","size":"10","delta":100000,"quantity":1}]},{"name":"airlineStaff_#1","transactions":[{"date":"2018-05-07T13:53:43.436+02:00","size":"10","delta":130000,"quantity":1}]}]}',
  unexpectedInput: 'thisIsNotAProperLog!',
  expectedInput: fs.readFileSync(path.join(__dirname, 'expectedLog.xes'), 'utf8'),
}


module.exports = testLogs
