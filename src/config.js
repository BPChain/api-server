const config = {
  ethereum: {
    privateChain: {
      name:
        'ethereum',
      schema:
        'ethereumSchema',
    },
    publicChain: {
      activeMiners:
      'https://api.nanopool.org/v1/eth/pool/activeminers',
      activeWorkers:
      'https://api.nanopool.org/v1/eth/pool/activeworkers',
      averageBlockTime:
      'https://api.nanopool.org/v1/eth/network/avgblocktime',
      blockTimeDifficulty:
      'https://api.nanopool.org/v1/eth/block_stats/0/5',
      hashRate:
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
