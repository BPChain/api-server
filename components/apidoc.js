/**
 * @api {get} /log Access Server Log
 * @apiName AccessLog
 * @apiGroup Logs
 *
 * @apiParam {Number} [startTime] Start time of timespan to get data for as UTC timestamp
 * @apiParam {Number} [endTime] End time of timespan to get data for as UTC timestamp
 * @apiParam {Number} [numberOfItems] Number of data entries to retrieve (max: 100000)
 * @apiParam {String} [logLevel] Lowest Log level to be retrieved.
 * Can be 'trace', 'debug', 'info', 'warn', 'error' or 'fatal'. Defaults to 'trace'.
 *
 * @apiSuccess (200) {HTML} HTML page displaying the log entries
 */

/**
 * @api {post} /scenarios/upload Upload a Scylla Log
 * @apiName UploadScenario
 * @apiGroup Scenario
 *
 * @apiParam {String} fileName Name of the uploaded scenario
 * @apiParam {String} [description] String desribing the scenario
 *
 */

/**
 * @api {get} /scenarios Get all defined scenarios
 * @apiName GetScenarios
 * @apiGroup Scenario
 *
 * @apiParam {String} [id] Id of the scenario to filter for
 *
 * @apiSuccess (200) {Object[]} scenarios List of scenarios
 * @apiSuccess (200) {Object[]} scenarios.scenario A single scenario
 * @apiSuccess (200) {String} scenarios.scenario.name Name of the scenario
 * @apiSuccess (200) {String} scenarios.scenario._id Unique id of the scenario
 * @apiSuccess (200) {String} [scenarios.scenario.description] Description of the scenario
 *
 */

/**
 * @api {post} /scenarios Manually define a scenario
 * @apiName DefineScenario
 * @apiGroup Scenario
 *
 * @apiParam {String} fileName Name of the uploaded scenario
 * @apiParam {String} [description] String desribing the scenario
 * @apiParam {Number} payloadSize Payload size of each transaction
 * @apiParam {Number} period The period time of transactions
 * @apiParam {Number} numberOfNodes The number of nodes for this scenario
 */

/**
 * @api {get} /chain Get Chain Info
 * @apiName GetChainInfo
 * @apiGroup Chains
 */

/**
 * @api {post} /chain Set Chain Parameters
 * @apiName SetChainParameters
 * @apiGroup Chains
 *
 * @apiParam {Object} parameters JSON-Object containing parameters to be set and their values.
 * Can also contain a scenario name.
 * @apiParam {String} chainName Name of the chain to configure
 * @apiParam {String} target Target system the chain is running on
 */

/**
 * @api {get} /chain/:accessibility(private|public)/:chainName Retrieve aggregated data for a chain
 * @apiName GetChainData
 * @apiGroup Chains
 *
 * @apiParam {String} accessibility Private or public
 * @apiParam {String} chainName Name of the chain to retieve data for
 * @apiParam {Number} [startTime] Start time of timespan to get data for
 * @apiParam {Number} [endTime] End time of timespan to get data for
 * @apiParam {Strign} target Target system the chain is running on
 * @apiParam {Number} [numberOfItems] Number of data entries to retrieve (max: 100000)
 *
 * @apiSuccess (200) {Object[]} data List of chainData
 * @apiSuccess (200) {Number} data.numberOfHosts Number of Hosts
 * @apiSuccess (200) {Number} data.numberOfMiners Number of Miners
 * @apiSuccess (200) {Number} data.avgHashrate Average Hashrate
 * @apiSuccess (200) {Number} data.avgBlocktime Average Blocktime
 * @apiSuccess (200) {Number} data.avgBlocksize Average Blocksize
 * @apiSuccess (200) {Number} data.avgDifficulty Average Difficulty
 * @apiSuccess (200) {Number} data.avgCpuUsage Average CPU Usage
 * @apiSuccess (200) {Number} data.avgTransactions Average Transactions
 * @apiSuccess (200) {Number} data.timeStamp Timestamp of Chain Data
 * @apiSuccess (200) {String} data.chainName Name of the chain
 *
 */

/**
 * @api {post} /chain/private/:chainName Store Chain Data
 * @apiName StoreChainData
 * @apiGroup Chains
 *
 * @apiParam {String} chainName Name of the chain to store data for
 * @apiParam {Object} data JSON object containing the chain data
 * @apiParam {String} data.hostId Host Id of the node
 * @apiParam {String} data.chainName Name of the running chain
 * @apiParam {String} data.target Target system the node is running on
 * @apiParam {Boolean} data.isMining Whether the node is mining or not
 * @apiParam {Number} data.hashrate Hashrate of the node
 * @apiParam {Number} data.avgBlocktime Average blocktime the node observed
 * @apiParam {Number} data.blockSize Blocksize of the last blocks
 * @apiParam {Number} data.avgDifficulty Average difficulty of the last blocks
 * @apiParam {Number} data.avgTransactions Average transactions
 * @apiParam {Number} data.cpuUsage CPU usage in percent
 */

/**
 * @api {get} /user/check Check Log In
 * @apiName CheckLogIn
 * @apiGroup User
 *
 * @apiSuccess (200) {StatusCode} 200 if user is alredy logged in
 * @apiError (401) {StatusCode} 401 if user is not logged in
 */

/**
 * @api {post} /user/login Log In
 * @apiName LogIn
 * @apiGroup User
 *
 * @apiParam {String} username Username to log in with
 * @apiParam {String} password Password for user
 *
 * @apiSuccess (200) {Boolean} status true if user loggged in
 * @apiError (200) {Boolean} status false if user could not be logged in
 */

/**
 * @api {post} /user/logout Log Out
 * @apiName LogOut
 * @apiGroup User
 *
 * @apiSuccess (200) {String} status "logged out" if user was logged out
 * @apiError (401) {StatusCode} status 401 User was not logged in
 */

/**
 * @api {post} /user/create Create New User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} username Unique username of user to create
 * @apiParam {String} password Password for new user
 *
 * @apiSuccess (200) {String} status "logged out" if user was logged out
 * @apiError (500) {StatusCode} status 500 User was not logged in
 */


/**
 * @api {get} /recordings Get List of Recordings
 * @apiName GetRecordings
 * @apiGroup Recording
 *
 * @apiSuccess (200) {Object} recordings List of all recordings
 * @apiSuccess (200) {String} recordings.recordingName Name of the recording,
 * @apiSuccess (200) {Timestamp} recordings.startTime start time of a recording
 * @apiSuccess (200) {Timestamp} recordings.endTime end time of a recording
 * @apiSuccess (200) {Object} recordings.chains List of all chains that were recorded
 */

/**
 * @api {get} /recordings/isRecording Check if currently recording
 * @apiName IsRecording
 * @apiGroup Recording
 * @apiSuccess (200) {Object} recording State of the recorder
 * @apiSuccess (200) {Timestamp} recording.creationDate start time of the current recording
 * @apiSuccess (200) {Boolean} recording.isRecording true if recording is currently in progress
 * @apiSuccess (200) {String} recording.recordingName Name of the recording,
 * if it's currently in progress
 */

/**
 * @api {post} /recordings/start Start Recording
 * @apiName StartRecording
 * @apiGroup Recording
 *
 * @apiParam {String} name Name of the recording that is to be started
 * @apiSuccess (200) {StatusCode} status 200 if recording could be started
 * @apiError (500) {String} status "A recording is already in progress"
 */

/**
 * @api {post} /recordings/stop Stop Recording
 * @apiName StopRecording
 * @apiGroup Recording
 * @apiSuccess (200) {StatusCode} status 200 if recording could be stopped
 */

/**
 * @api {post} /recordings/cancel Cancel Recording
 * @apiName CancelRecording
 * @apiGroup Recording
 * @apiSuccess (200) {StatusCode} status 200 if recording could be cancelled
 */
