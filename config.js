module.exports =  {
  ethereum: {
    publicChain: {
      numberOfMiners:
      'https://api.nanopool.org/v1/eth/pool/activeminers',
      numberOfWorkers:
      'https://api.nanopool.org/v1/eth/pool/activeworkers',
      avgBlocktime:
      'https://api.nanopool.org/v1/eth/network/avgblocktime',
      blockTimeDifficulty:
      'https://api.nanopool.org/v1/eth/block_stats/0/5',
      avgHashrate:
      'https://api.nanopool.org/v1/eth/pool/hashrate',
      timeToNextEpoch:
      'https://api.nanopool.org/v1/eth/network/timetonextepoch',
    },
  },
  ports: {
    dataAggregator: 3030,
    frontend: 2020,
    controller: 4040,
  },
  bufferSwitchTime: 30000,
  publicPollTime: 120000,
}
