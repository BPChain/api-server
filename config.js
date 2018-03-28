const config = {
  activePrivateChains: [
    'ethereum',
    'xain',
    'multichain',
  ],
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
  dataAggregatorPort: 3030,
  frontendPort: 2020,
  controllerPort: 4040,
  bufferSwitchTime: 15000,
  publicPollTime: 30000,
}

module.exports = config
